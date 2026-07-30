package key

import (
	"crypto/ed25519"
	"crypto/x509"
	"encoding/pem"
	"fmt"
)

type Key struct {
	PrivateKey ed25519.PrivateKey
	PublicKey  ed25519.PublicKey
}

// LoadPublicKey loads the public key
func (k *Key) LoadPublicKey(keyContents []byte) (err error) {
	if k.PublicKey != nil {
		return
	}

	block, _ := pem.Decode(keyContents)
	if block == nil {
		return fmt.Errorf("invalid public key format")
	}
	pub, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return
	}
	k.PublicKey = pub.(ed25519.PublicKey)
	return
}

// LoadPrivateKey Loads the private key
func (k *Key) LoadPrivateKey(keyContents []byte) (err error) {
	if k.PrivateKey != nil {
		return
	}

	block, _ := pem.Decode(keyContents)
	if block == nil {
		return fmt.Errorf("invalid private key format")
	}
	prv, err := x509.ParsePKCS8PrivateKey(block.Bytes)
	if err != nil {
		return
	}
	k.PrivateKey = prv.(ed25519.PrivateKey)
	k.PublicKey = k.PrivateKey.Public().(ed25519.PublicKey)
	return
}
