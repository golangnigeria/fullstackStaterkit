package server

import (
	"context"
	"crypto/sha256"
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/jackc/pgx/v5/stdlib"
	"github.com/newrelic/go-agent/v3/integrations/nrredis-v9"
	"github.com/redis/go-redis/v9"
	"github.com/rs/zerolog"
	"github.com/thecodearcher/limen"
	sqladapter "github.com/thecodearcher/limen/adapters/sql"
	credentialpassword "github.com/thecodearcher/limen/plugins/credential-password"
	"github.com/tutorlinkng/tutorlinkng/internal/config"
	"github.com/tutorlinkng/tutorlinkng/internal/database"
	"github.com/tutorlinkng/tutorlinkng/internal/lib/email"
	"github.com/tutorlinkng/tutorlinkng/internal/lib/job"
	loggerPkg "github.com/tutorlinkng/tutorlinkng/internal/logger"
)

type Server struct {
	Config        *config.Config
	Logger        *zerolog.Logger
	LoggerService *loggerPkg.LoggerService
	DB            *database.Database
	SqlDB         *sql.DB
	Redis         *redis.Client
	httpServer    *http.Server
	Job           *job.JobService
	Limen         *limen.Limen
	Email         *email.Client
}

func New(cfg *config.Config, logger *zerolog.Logger, loggerService *loggerPkg.LoggerService) (*Server, error) {
	db, err := database.New(cfg, logger, loggerService)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize database: %w", err)
	}

	// Redis client with New Relic integration
	redisClient := redis.NewClient(&redis.Options{
		Addr:     cfg.Redis.Address,
		Password: cfg.Redis.Password,
		DB:       0,
	})

	// Add New Relic Redis hooks if available
	if loggerService != nil && loggerService.GetApplication() != nil {
		redisClient.AddHook(nrredis.NewHook(redisClient.Options()))
	}

	// Test Redis connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := redisClient.Ping(ctx).Err(); err != nil {
		logger.Error().Err(err).Msg("Failed to connect to Redis, continuing without Redis")
		// Don't fail startup if Redis is unavailable
	}

	// job service
	jobService := job.NewJobService(logger, cfg)
	jobService.InitHandlers(cfg, logger)

	// Start job server
	if err := jobService.Start(); err != nil {
		return nil, err
	}

	emailClient := email.NewClient(cfg, logger)

	sqlDB := stdlib.OpenDBFromPool(db.Pool)
	limenSecret := sha256.Sum256([]byte(cfg.Auth.SecretKey))

	// Hooks to send welcome email upon registration
	hooks := &limen.Hooks{
		After: []*limen.Hook{
			{
				PathMatcher: func(hc *limen.HookContext) bool {
					return hc.Path() == "/signup/credential" || hc.RouteID() == "signup"
				},
				Run: func(hc *limen.HookContext) bool {
					if hc.StatusCode() >= 200 && hc.StatusCode() < 300 {
						authResult := hc.GetAuthResult()
						if authResult != nil && authResult.User != nil {
							userEmail := authResult.User.Email
							firstName := ""
							if raw := authResult.User.Raw(); raw != nil {
								if fn, ok := raw["firstname"].(string); ok && fn != "" {
									firstName = fn
								} else if fn, ok := raw["first_name"].(string); ok && fn != "" {
									firstName = fn
								}
							}
							logger.Info().
								Str("email", userEmail).
								Str("first_name", firstName).
								Msg("User registered - sending welcome email")

							go func(to, fName string) {
								if err := emailClient.SendWelcomeEmail(to, fName); err != nil {
									logger.Error().Err(err).Str("email", to).Msg("Failed to send welcome email")
								}
							}(userEmail, firstName)
						}
					}
					return true
				},
			},
		},
	}

	limenAuth, err := limen.New(&limen.Config{
		BaseURL:  "http://localhost:" + cfg.Server.Port,
		Database: sqladapter.NewPostgreSQL(sqlDB),
		Secret:   limenSecret[:],
		Session:  limen.NewDefaultSessionConfig(limen.WithBearerEnabled()),
		HTTP: limen.NewDefaultHTTPConfig(
			limen.WithHTTPTrustedOrigins(cfg.Server.CORSAllowedOrigins),
			limen.WithHTTPHooks(hooks),
		),
		Email: limen.NewDefaultEmailConfig(
			limen.WithEmailVerification(
				limen.WithSendEmailVerificationMail(func(emailAddr string, token string) {
					frontendURL := os.Getenv("FRONTEND_URL")
					if frontendURL == "" && cfg.Server.FrontendURL != "" {
						frontendURL = cfg.Server.FrontendURL
					}
					if frontendURL == "" && len(cfg.Server.CORSAllowedOrigins) > 0 && cfg.Server.CORSAllowedOrigins[0] != "" {
						frontendURL = cfg.Server.CORSAllowedOrigins[0]
					}
					if frontendURL == "" {
						frontendURL = "http://localhost:3000"
					}
					verifyURL := fmt.Sprintf("%s/auth/verify-email?token=%s", frontendURL, token)
					logger.Info().
						Str("email", emailAddr).
						Str("verify_url", verifyURL).
						Str("verify_code", token).
						Msg("Email verification requested - sending verification email")

					if err := emailClient.SendEmailVerificationEmail(emailAddr, verifyURL, token); err != nil {
						logger.Error().Err(err).Str("email", emailAddr).Msg("Failed to send email verification email")
					}
				}),
				limen.WithAutoSignInAfterVerification(),
			),
		),
		Plugins: []limen.Plugin{
			credentialpassword.New(
				credentialpassword.WithAutoSignInOnSignUp(false),
				credentialpassword.WithRequireEmailVerification(true),
				credentialpassword.WithSendEmailVerificationOnSignIn(),
				credentialpassword.WithSendPasswordResetEmail(func(emailAddr string, token string) {
					frontendURL := os.Getenv("FRONTEND_URL")
					if frontendURL == "" && cfg.Server.FrontendURL != "" {
						frontendURL = cfg.Server.FrontendURL
					}
					if frontendURL == "" && len(cfg.Server.CORSAllowedOrigins) > 0 && cfg.Server.CORSAllowedOrigins[0] != "" {
						frontendURL = cfg.Server.CORSAllowedOrigins[0]
					}
					if frontendURL == "" {
						frontendURL = "http://localhost:3000"
					}
					resetURL := fmt.Sprintf("%s/auth/reset-password?token=%s", frontendURL, token)
					logger.Info().
						Str("email", emailAddr).
						Str("reset_url", resetURL).
						Str("reset_code", token).
						Msg("Password reset requested - sending reset email")

					if err := emailClient.SendPasswordResetEmail(emailAddr, resetURL, token); err != nil {
						logger.Error().Err(err).Str("email", emailAddr).Msg("Failed to send password reset email")
					}
				}),
			),
		},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to initialize limen auth: %w", err)
	}

	server := &Server{
		Config:        cfg,
		Logger:        logger,
		LoggerService: loggerService,
		DB:            db,
		SqlDB:         sqlDB,
		Redis:         redisClient,
		Job:           jobService,
		Limen:         limenAuth,
		Email:         emailClient,
	}

	// Start metrics collection
	// Runtime metrics are automatically collected by New Relic Go agent

	return server, nil
}

func (s *Server) SetupHTTPServer(handler http.Handler) {
	s.httpServer = &http.Server{
		Addr:         ":" + s.Config.Server.Port,
		Handler:      handler,
		ReadTimeout:  time.Duration(s.Config.Server.ReadTimeout) * time.Second,
		WriteTimeout: time.Duration(s.Config.Server.WriteTimeout) * time.Second,
		IdleTimeout:  time.Duration(s.Config.Server.IdleTimeout) * time.Second,
	}
}

func (s *Server) Start() error {
	if s.httpServer == nil {
		return errors.New("HTTP server not initialized")
	}

	s.Logger.Info().
		Str("port", s.Config.Server.Port).
		Str("env", s.Config.Primary.Env).
		Msg("starting server")

	return s.httpServer.ListenAndServe()
}

func (s *Server) Shutdown(ctx context.Context) error {
	if err := s.httpServer.Shutdown(ctx); err != nil {
		return fmt.Errorf("failed to shutdown HTTP server: %w", err)
	}

	if s.SqlDB != nil {
		_ = s.SqlDB.Close()
	}

	if err := s.DB.Close(); err != nil {
		return fmt.Errorf("failed to close database connection: %w", err)
	}

	if s.Job != nil {
		s.Job.Stop()
	}

	return nil
}
