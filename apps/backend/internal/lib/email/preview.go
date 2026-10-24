package email

var PreviewData = map[string]map[string]string{
	"welcome": {
		"UserFirstName": "John",
	},
	"reset-password": {
		"UserEmail": "alex@example.com",
		"ResetURL":  "http://localhost:3000/auth/reset-password?token=sample-reset-token-12345",
	},
}
