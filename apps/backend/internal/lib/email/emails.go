package email

import (
	"fmt"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/tutorlinkng/tutorlinkng/internal/model/todo"
)

func (c *Client) SendWelcomeEmail(to, firstName string) error {
	appName := c.GetAppName()
	if appName == "" {
		appName = "TutorlinkNG"
	}

	data := map[string]any{
		"UserFirstName": firstName,
		"AppName":       appName,
	}

	subject := os.Getenv("WELCOME_EMAIL_SUBJECT")
	if subject == "" {
		subject = fmt.Sprintf("Welcome to %s!", appName)
	}

	return c.SendEmail(
		to,
		subject,
		TemplateWelcome,
		data,
	)
}

func (c *Client) SendPasswordResetEmail(to, resetURL, resetCode string) error {
	appName := c.GetAppName()
	if appName == "" {
		appName = "TutorlinkNG"
	}

	data := map[string]any{
		"UserEmail": to,
		"ResetURL":  resetURL,
		"ResetCode": resetCode,
		"Code":      resetCode,
		"AppName":   appName,
	}

	c.logger.Info().
		Str("to", to).
		Str("reset_url", resetURL).
		Str("reset_code", resetCode).
		Msg("🔑 Password Reset code generated")

	subject := os.Getenv("RESET_PASSWORD_EMAIL_SUBJECT")
	if subject == "" {
		subject = fmt.Sprintf("Your %s Password Reset Code", appName)
	}

	return c.SendEmail(
		to,
		subject,
		TemplateResetPassword,
		data,
	)
}

func (c *Client) SendEmailVerificationEmail(to, verifyURL, verifyCode string) error {
	appName := c.GetAppName()
	if appName == "" {
		appName = "TutorlinkNG"
	}

	data := map[string]any{
		"UserEmail":  to,
		"VerifyURL":  verifyURL,
		"VerifyCode": verifyCode,
		"Code":       verifyCode,
		"AppName":    appName,
	}

	c.logger.Info().
		Str("to", to).
		Str("verify_url", verifyURL).
		Str("verify_code", verifyCode).
		Msg("🔑 Email verification code generated")

	subject := os.Getenv("VERIFY_EMAIL_SUBJECT")
	if subject == "" {
		subject = fmt.Sprintf("Verify your %s email address", appName)
	}

	return c.SendEmail(
		to,
		subject,
		TemplateVerifyEmail,
		data,
	)
}

func (c *Client) SendDueDateReminderEmail(to, todoTitle string, todoID uuid.UUID, dueDate time.Time) error {
	data := map[string]interface{}{
		"TodoTitle":    todoTitle,
		"TodoID":       todoID.String(),
		"DueDate":      dueDate.Format("Monday, January 2, 2006 at 3:04 PM"),
		"DaysUntilDue": int(dueDate.Sub(time.Now()).Hours() / 24),
	}

	return c.SendEmail(
		to,
		fmt.Sprintf("Reminder: '%s' is due soon", todoTitle),
		TemplateDueDateReminder,
		data,
	)
}

func (c *Client) SendOverdueNotificationEmail(to, todoTitle string, todoID uuid.UUID, dueDate time.Time) error {
	data := map[string]interface{}{
		"TodoTitle":   todoTitle,
		"TodoID":      todoID.String(),
		"DueDate":     dueDate.Format("Monday, January 2, 2006 at 3:04 PM"),
		"DaysOverdue": int(time.Now().Sub(dueDate).Hours() / 24),
	}

	return c.SendEmail(
		to,
		fmt.Sprintf("Overdue: '%s' needs your attention", todoTitle),
		TemplateOverdueNotification,
		data,
	)
}

func (c *Client) SendWeeklyReportEmail(to string, weekStart, weekEnd time.Time,
	completedCount, activeCount, overdueCount int, completedTodos, overdueTodos []todo.PopulatedTodo,
) error {
	data := map[string]interface{}{
		"WeekStart":      weekStart.Format("January 2, 2006"),
		"WeekEnd":        weekEnd.Format("January 2, 2006"),
		"CompletedCount": completedCount,
		"ActiveCount":    activeCount,
		"OverdueCount":   overdueCount,
		"CompletedTodos": completedTodos,
		"OverdueTodos":   overdueTodos,
		"HasCompleted":   completedCount > 0,
		"HasOverdue":     overdueCount > 0,
	}

	return c.SendEmail(
		to,
		fmt.Sprintf("Your Weekly Productivity Report (%s - %s)",
			weekStart.Format("Jan 2"), weekEnd.Format("Jan 2")),
		TemplateWeeklyReport,
		data,
	)
}
