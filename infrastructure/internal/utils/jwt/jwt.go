package jwt

import (
	"fmt"
	"time"

	"github.com/BiltuDas1/GitShip/internal/utils/key"
	"github.com/google/uuid"
)

// JWT is the container of Refresh Token and Access Token
type JWT struct {
	RefreshToken Token
	AccessToken  Token
}

// NewJWT Initialize the JWT object
func NewJWT(signinKey key.Key, accessToken_expiry time.Time, refreshToken_expiry time.Time, subject string) (*JWT, error) {
	jwt := JWT{}
	now := time.Now()

	accessTokenJTI, err := uuid.NewV7()
	if err != nil {
		return nil, fmt.Errorf("failed to generate accessToken JTI: %v", err)
	}
	accessToken, err := NewToken(subject, accessTokenJTI.String(), now, accessToken_expiry, TokenTypeAccess, signinKey.PrivateKey)
	if err != nil {
		return nil, fmt.Errorf("failed to create accessToken Object: %v", err)
	}
	jwt.AccessToken = *accessToken

	refreshTokenJTI, err := uuid.NewV7()
	if err != nil {
		return nil, fmt.Errorf("failed to generate refreshToken JTI: %v", err)
	}
	refreshToken, err := NewToken(subject, refreshTokenJTI.String(), now, refreshToken_expiry, TokenTypeRefresh, signinKey.PrivateKey)
	if err != nil {
		return nil, fmt.Errorf("failed to create refreshToken Object: %v", err)
	}
	jwt.RefreshToken = *refreshToken
	return &jwt, nil
}

// ToMap returns a map containing access_token and refresh_token string
func (j *JWT) ToMap() map[string]string {
	return map[string]string{
		"access_token":  j.AccessToken.GetToken(),
		"refresh_token": j.RefreshToken.GetToken(),
	}
}
