package jwt

type TokenType string

const (
	TokenTypeAccess  TokenType = "at+jwt"
	TokenTypeRefresh TokenType = "rt+jwt"
)
