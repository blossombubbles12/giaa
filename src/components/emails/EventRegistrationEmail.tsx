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

interface EventRegistrationEmailProps {
  name: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
}

export const EventRegistrationEmail = ({
  name = "Participant",
  eventTitle = "Professional Event",
  eventDate = "TBD",
  eventLocation = "TBD",
}: EventRegistrationEmailProps) => (
  <Html>
    <Head />
    <Preview>Registration Confirmed: {eventTitle}</Preview>
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
          <Heading style={h1}>Registration Confirmed!</Heading>
          <Text style={paragraph}>
            Hi {name},
          </Text>
          <Text style={paragraph}>
            Your registration for <strong>{eventTitle}</strong> has been successfully confirmed. We are excited to have you join us!
          </Text>
          <Section style={{ padding: '20px', backgroundColor: '#f1f5f9', borderRadius: '8px', margin: '20px 0' }}>
            <Text style={{ ...paragraph, margin: 0, fontWeight: 'bold' }}>Event Details:</Text>
            <Text style={{ ...paragraph, margin: '5px 0' }}><strong>Date & Time:</strong> {eventDate}</Text>
            <Text style={{ ...paragraph, margin: '5px 0' }}><strong>Location:</strong> {eventLocation}</Text>
          </Section>
          <Text style={paragraph}>
            If you have any questions or need to cancel your registration, please contact us at info@giaadvisory.com.
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

export default EventRegistrationEmail;

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
