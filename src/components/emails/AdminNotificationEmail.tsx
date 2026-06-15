import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface AdminNotificationEmailProps {
  name: string;
  email: string;
  adminUrl: string;
}

export const AdminNotificationEmail = ({
  name,
  email,
  adminUrl,
}: AdminNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>New Student Registration: {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            src={`https://giaadvisory.com/gialogo.png`}
            width="200"
            height="auto"
            alt="GIA Advisory Logo"
            style={logo}
          />
          <Heading style={h1}>New Student Enrolled</Heading>
          <Text style={paragraph}>
            Hello Admin, you have a new student registration on the platform.
          </Text>
          <Section style={infoBox}>
            <Text style={label}>Name:</Text>
            <Text style={value}>{name}</Text>
            <Text style={label}>Email:</Text>
            <Text style={value}>{email}</Text>
            <Text style={label}>Enrolment Date:</Text>
            <Text style={value}>{new Date().toLocaleDateString()}</Text>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Manage users and applications from your admin dashboard:
          </Text>
          <Section style={buttonContainer}>
            <a href={adminUrl} style={button}>
              Go to Admin Dashboard
            </a>
          </Section>
          <Text style={footer}>
            © 2026 GIA Advisory. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AdminNotificationEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const logo = {
  margin: "0 auto",
  display: "block",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
};

const infoBox = {
  backgroundColor: "#f9fafb",
  padding: "16px",
  borderRadius: "8px",
  margin: "24px 0",
};

const label = {
  fontSize: "12px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  color: "#6b7280",
  margin: "0 0 4px",
};

const value = {
  fontSize: "16px",
  color: "#111827",
  margin: "0 0 12px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#1e293b",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
};
