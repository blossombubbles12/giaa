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

interface AdminEventNotificationEmailProps {
  userName: string;
  userEmail: string;
  eventTitle: string;
}

export const AdminEventNotificationEmail = ({
  userName = "A user",
  userEmail = "user@example.com",
  eventTitle = "An Event",
}: AdminEventNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>New Registration: {eventTitle}</Preview>
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
          <Heading style={h1}>New Event Registration</Heading>
          <Text style={paragraph}>
            A new user has registered for an event.
          </Text>
          <Section style={{ padding: '20px', backgroundColor: '#f1f5f9', borderRadius: '8px', margin: '20px 0' }}>
            <Text style={{ ...paragraph, margin: '5px 0' }}><strong>Participant:</strong> {userName} ({userEmail})</Text>
            <Text style={{ ...paragraph, margin: '5px 0' }}><strong>Event:</strong> {eventTitle}</Text>
          </Section>
          <Text style={paragraph}>
            You can view more details in the admin dashboard.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            © {new Date().getFullYear()} GIA Advisory. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AdminEventNotificationEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
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
  textAlign: "left" as const,
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
