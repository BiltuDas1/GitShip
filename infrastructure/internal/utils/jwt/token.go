package jwt

import (
	"crypto/ed25519"
	"encoding/json"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Token struct {
	jwt    *jwt.Token
	claims jwt.RegisteredClaims
	token  string
	typ    TokenType
}

// NewToken creates a new Token object
func NewToken(sub string, jti string, creation_time time.Time, expiry_time time.Time, typ TokenType, secret_key ed25519.PrivateKey) (*Token, error) {
	jwt_token := jwt.NewWithClaims(&jwt.SigningMethodEd25519{}, jwt.RegisteredClaims{
		ID:        jti,
		Subject:   sub,
		IssuedAt:  jwt.NewNumericDate(creation_time),
		ExpiresAt: jwt.NewNumericDate(expiry_time),
	})
	jwt_token.Header["typ"] = typ
	tknObj := Token{}
	tknObj.jwt = jwt_token
	token, err := jwt_token.SignedString(secret_key)
	tknObj.token = token
	tknObj.claims = jwt_token.Claims.(jwt.RegisteredClaims)
	tknObj.typ = typ
	return &tknObj, err
}

// ParseToken creates a New Token Object from JWT String
func ParseToken(token string, public_key ed25519.PublicKey) (*Token, error) {
	jwt_token, err := jwt.Parse(token, func(key *jwt.Token) (any, error) {
		if _, ok := key.Method.(*jwt.SigningMethodEd25519); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", key.Header["alg"])
		}
		return public_key, nil
	})

	if err != nil {
		return nil, fmt.Errorf("%w", err)
	}
	tknObj := Token{}
	tknObj.jwt = jwt_token
	tknObj.token = token
	data, err := json.Marshal(tknObj.jwt.Claims.(jwt.MapClaims))
	if err != nil {
		return nil, fmt.Errorf("unable to parse jwt claims as jwt.MapClaims")
	}
	if err := json.Unmarshal(data, &tknObj.claims); err != nil {
		return nil, fmt.Errorf("failed to convert json to jwt.RegisteredClaims")
	}
	if value, exist := jwt_token.Header["typ"]; exist {
		switch value {
		case "at+jwt":
			tknObj.typ = TokenTypeAccess
		case "rt+jwt":
			tknObj.typ = TokenTypeRefresh
		default:
			return nil, fmt.Errorf("invalid header typ")
		}
		return &tknObj, nil
	}
	return nil, fmt.Errorf("no typ header found")
}

// GetToken returns The JWT Token
func (tknObj *Token) GetToken() string {
	return tknObj.token
}

// GetJTI returns the JTI of the JWT
func (tknObj *Token) GetJTI() string {
	return tknObj.claims.ID
}

// GetSub returns the Subject of the JWT
func (tknObj *Token) GetSub() string {
	return tknObj.claims.Subject
}

// GetCreationTime returns the creation time of the JWT
func (tknObj *Token) GetCreationTime() time.Time {
	return tknObj.claims.IssuedAt.Time
}

// GetExpiryTime returns the expiry time of the JWT
func (tknObj *Token) GetExpiryTime() time.Time {
	return tknObj.claims.ExpiresAt.Time
}

// GetTokenType returns the type of the token
func (tknObj *Token) GetTokenType() TokenType {
	return tknObj.typ
}
