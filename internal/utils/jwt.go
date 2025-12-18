package utils

import (
	"crypto/ed25519"
	"crypto/x509"
	"encoding/pem"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

// JWT struct handles the JWT stuffs like verification,
// it internally uses EdDSA algorithm
type JWT struct {
	publicKey ed25519.PublicKey
}

// LoadPublicKey loads the public key to JWT object
func (j *JWT) LoadPublicKey(keyContents []byte) (err error) {
	if j.publicKey != nil {
		return
	}

	block, _ := pem.Decode(keyContents)
	pub, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return
	}
	j.publicKey = pub.(ed25519.PublicKey)
	return
}

// Verify verifies if the JWT Token is valid or not
func (j *JWT) Verify(token string) (bool, error) {
	if j.publicKey == nil {
		return false, fmt.Errorf("eddsa public key is not loaded")
	}

	key, err := jwt.Parse(token, func(key *jwt.Token) (any, error) {
		if _, ok := key.Method.(*jwt.SigningMethodEd25519); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", key.Header["alg"])
		}
		return j.publicKey, nil
	})

	if err != nil || !key.Valid {
		return false, err
	}
	return true, nil
}
