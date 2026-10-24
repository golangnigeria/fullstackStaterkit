import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  userEmail?: string;
  resetCode?: string;
  resetUrl?: string;
}

export const ResetPasswordEmail = ({
  userEmail = "{{.UserEmail}}",
  resetCode = "{{.ResetCode}}",
  resetUrl = "{{.ResetURL}}",
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your TutorlinkNG password reset code</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white p-8 rounded-lg shadow-sm my-10 mx-auto max-w-[600px]">
            <Heading className="text-2xl font-bold text-gray-800 mt-4">
              Password Reset Code
            </Heading>

            <Section className="mt-4">
              <Text className="text-gray-700 text-base">
                Hello {userEmail},
              </Text>
              <Text className="text-gray-700 text-base">
                We received a request to reset your TutorlinkNG account password. Use the verification code below on the password reset page:
              </Text>
            </Section>

            <Section className="my-6 text-center bg-gray-50 border border-gray-200 rounded-lg p-6">
              <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
                Verification Code
              </Text>
              <Text className="font-mono text-3xl font-bold tracking-widest text-indigo-600 select-all my-2">
                {resetCode}
              </Text>
              <Text className="text-gray-500 text-xs mt-2">
                Copy and paste this code into the verification code field.
              </Text>
            </Section>

            <Section className="my-6 text-center">
              <Text className="text-gray-600 text-sm mb-3">
                Or click the button below to reset directly:
              </Text>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md px-6 py-3 text-sm no-underline inline-block"
                href={resetUrl}
              >
                Reset Password
              </Button>
            </Section>

            <Section>
              <Text className="text-gray-500 text-xs mt-3">
                This verification code will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
              </Text>
            </Section>

            <Hr className="border-gray-200 my-6" />

            <Section className="mt-6 text-center">
              <Text className="text-gray-500 text-xs">
                © {new Date().getFullYear()} TutorlinkNG. All rights reserved.
              </Text>
              <Text className="text-gray-400 text-xs">
                Need help? Contact support if you need further assistance.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ResetPasswordEmail.PreviewProps = {
  userEmail: "alex@example.com",
  resetCode: "A9X4-K82M-P91Q",
  resetUrl: "http://localhost:3000/auth/reset-password?token=A9X4-K82M-P91Q",
};

export default ResetPasswordEmail;
