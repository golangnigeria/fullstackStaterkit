package service

import (
	"context"
	"fmt"

	"github.com/tutorlinkng/tutorlinkng/internal/server"
)

type AuthService struct {
	server *server.Server
}

func NewAuthService(s *server.Server) *AuthService {
	return &AuthService{
		server: s,
	}
}

func (s *AuthService) GetUserEmail(ctx context.Context, userID string) (string, error) {
	var email string
	err := s.server.DB.Pool.QueryRow(ctx, "SELECT email FROM users WHERE id::text = $1", userID).Scan(&email)
	if err != nil {
		return "", fmt.Errorf("failed to get user email: %w", err)
	}
	return email, nil
}
