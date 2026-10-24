package middleware

import (
	"fmt"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/tutorlinkng/tutorlinkng/internal/errs"
	"github.com/tutorlinkng/tutorlinkng/internal/server"
)

type AuthMiddleware struct {
	server *server.Server
}

func NewAuthMiddleware(s *server.Server) *AuthMiddleware {
	return &AuthMiddleware{
		server: s,
	}
}

func (auth *AuthMiddleware) RequireAuth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		start := time.Now()

		session, err := auth.server.Limen.GetSession(c.Request())
		if err != nil || session == nil {
			auth.server.Logger.Error().
				Str("function", "RequireAuth").
				Str("request_id", GetRequestID(c)).
				Dur("duration", time.Since(start)).
				Msg("unauthorized: invalid or missing session")
			return errs.NewUnauthorizedError("Unauthorized", false)
		}

		c.Set("user_id", fmt.Sprint(session.User.ID))
		c.Set("user_email", session.User.Email)
		c.Set("user_role", "user")

		auth.server.Logger.Info().
			Str("function", "RequireAuth").
			Str("user_id", fmt.Sprint(session.User.ID)).
			Str("request_id", GetRequestID(c)).
			Dur("duration", time.Since(start)).
			Msg("user authenticated successfully")

		return next(c)
	}
}
