package email

import (
	"bytes"
	"fmt"
	"html"
	"html/template"
	"os"
	"regexp"
	"strings"

	"github.com/pkg/errors"
	"github.com/resend/resend-go/v2"
	"github.com/rs/zerolog"
	"github.com/tutorlinkng/tutorlinkng/internal/config"
)

var (
	htmlTagRegex       = regexp.MustCompile(`(?s)<style.*?>.*?</style>|<script.*?>.*?</script>|<[^>]+>`)
	consecutiveSpaces  = regexp.MustCompile(`[ \t]+`)
	consecutiveNewline = regexp.MustCompile(`\n{3,}`)
)

func htmlToPlainText(htmlContent string) string {
	replacer := strings.NewReplacer(
		"<br>", "\n",
		"<br/>", "\n",
		"<br />", "\n",
		"</p>", "\n\n",
		"</div>", "\n",
		"</h1>", "\n\n",
		"</h2>", "\n\n",
		"</h3>", "\n\n",
		"</td>", " ",
		"</tr>", "\n",
	)
	text := replacer.Replace(htmlContent)
	text = htmlTagRegex.ReplaceAllString(text, "")
	text = html.UnescapeString(text)
	text = consecutiveSpaces.ReplaceAllString(text, " ")
	text = consecutiveNewline.ReplaceAllString(text, "\n\n")
	return strings.TrimSpace(text)
}

type Client struct {
	client *resend.Client
	logger *zerolog.Logger
	cfg    *config.Config
}

func NewClient(cfg *config.Config, logger *zerolog.Logger) *Client {
	return &Client{
		client: resend.NewClient(cfg.Integration.ResendAPIKey),
		logger: logger,
		cfg:    cfg,
	}
}

func (c *Client) GetFromName() string {
	if c.cfg != nil && c.cfg.Integration.FromName != "" {
		return c.cfg.Integration.FromName
	}
	if val := os.Getenv("FROM_NAME"); val != "" {
		return val
	}
	if c.cfg != nil && c.cfg.Integration.AppName != "" {
		return c.cfg.Integration.AppName
	}
	if val := os.Getenv("APP_NAME"); val != "" {
		return val
	}
	return os.Getenv("TUTORLINKNG_INTEGRATION.FROM_NAME")
}

func (c *Client) GetFromEmail() string {
	if c.cfg != nil && c.cfg.Integration.FromEmail != "" {
		return c.cfg.Integration.FromEmail
	}
	if val := os.Getenv("FROM_EMAIL"); val != "" {
		return val
	}
	if val := os.Getenv("RESEND_FROM_EMAIL"); val != "" {
		return val
	}
	return os.Getenv("TUTORLINKNG_INTEGRATION.FROM_EMAIL")
}

func (c *Client) GetAppName() string {
	if c.cfg != nil && c.cfg.Integration.AppName != "" {
		return c.cfg.Integration.AppName
	}
	if val := os.Getenv("APP_NAME"); val != "" {
		return val
	}
	if name := c.GetFromName(); name != "" {
		return name
	}
	return os.Getenv("TUTORLINKNG_INTEGRATION.APP_NAME")
}

func (c *Client) GetTemplatesDir() string {
	if c.cfg != nil && c.cfg.Integration.TemplatesDir != "" {
		return c.cfg.Integration.TemplatesDir
	}
	if val := os.Getenv("EMAIL_TEMPLATES_DIR"); val != "" {
		return val
	}
	if val := os.Getenv("TUTORLINKNG_INTEGRATION.TEMPLATES_DIR"); val != "" {
		return val
	}
	return "templates/emails"
}

func (c *Client) SendEmail(to, subject string, templateName Template, data map[string]any) error {
	tmplDir := c.GetTemplatesDir()
	tmplPath := fmt.Sprintf("%s/%s.html", tmplDir, templateName)

	tmpl, err := template.ParseFiles(tmplPath)
	if err != nil {
		return errors.Wrapf(err, "failed to parse email template %s from %s", templateName, tmplPath)
	}

	var body bytes.Buffer
	if err := tmpl.Execute(&body, data); err != nil {
		return errors.Wrapf(err, "failed to execute email template %s", templateName)
	}

	isDev := false
	if c.cfg != nil {
		env := strings.ToLower(c.cfg.Primary.Env)
		isDev = env == "local" || env == "development" || env == "test" || c.cfg.Integration.ResendAPIKey == "resend_key" || c.cfg.Integration.ResendAPIKey == ""
	} else {
		env := strings.ToLower(os.Getenv("ENV"))
		if env == "" {
			env = strings.ToLower(os.Getenv("TUTORLINKNG_PRIMARY.ENV"))
		}
		isDev = env == "local" || env == "development" || env == ""
	}

	fromName := c.GetFromName()
	fromEmail := c.GetFromEmail()
	if fromEmail == "" {
		return errors.New("sender email is not configured: please set FROM_EMAIL or TUTORLINKNG_INTEGRATION.FROM_EMAIL in your environment")
	}
	if fromName == "" {
		fromName = c.GetAppName()
		if fromName == "" {
			fromName = "TutorlinkNG"
		}
	}

	rawHTML := body.String()
	plainText := htmlToPlainText(rawHTML)

	params := &resend.SendEmailRequest{
		From:    fmt.Sprintf("%s <%s>", fromName, fromEmail),
		To:      []string{to},
		Subject: subject,
		Html:    rawHTML,
		Text:    plainText,
		ReplyTo: fromEmail,
	}

	c.logger.Info().
		Str("to", to).
		Str("from", params.From).
		Str("subject", subject).
		Str("template", string(templateName)).
		Msg("Sending email")

	_, err = c.client.Emails.Send(params)
	if err != nil {
		if isDev {
			c.logger.Warn().
				Err(err).
				Str("to", to).
				Str("from", params.From).
				Str("subject", subject).
				Msg("Resend API delivery failed or unconfigured in dev mode; email was logged locally for development")
			return nil
		}
		return fmt.Errorf("failed to send email: %w", err)
	}

	return nil
}
