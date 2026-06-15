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
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface CourseInvoiceEmailProps {
  userName: string;
  courseTitle: string;
  amount: string;
  currencySymbol: string;
  invoiceNumber: string;
  date: string;
  paymentMethod: string;
  status: string;
}

export const CourseInvoiceEmail = ({
  userName,
  courseTitle,
  amount,
  currencySymbol,
  invoiceNumber,
  date,
  paymentMethod,
  status,
}: CourseInvoiceEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Invoice for {courseTitle} | GIA Advisory</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            src={`https://giaadvisory.com/gialogo.png`}
            width="150"
            height="auto"
            alt="GIA Advisory Logo"
            style={logo}
          />
          <Heading style={h1}>Course Enrollment Invoice</Heading>
          <Text style={paragraph}>
            Hi {userName},
          </Text>
          <Text style={paragraph}>
            Thank you for enrolling in **{courseTitle}**. This email serves as your official invoice and enrollment confirmation request.
          </Text>
          
          <Section style={invoiceBox}>
            <Row style={invoiceHeader}>
              <Column>
                <Text style={invoiceLabel}>Invoice Number</Text>
                <Text style={invoiceValue}>#{invoiceNumber}</Text>
              </Column>
              <Column style={{ textAlign: 'right' as const }}>
                <Text style={invoiceLabel}>Date</Text>
                <Text style={invoiceValue}>{date}</Text>
              </Column>
            </Row>
            
            <Hr style={hr} />
            
            <Row style={itemRow}>
              <Column>
                <Text style={itemText}>{courseTitle}</Text>
              </Column>
              <Column style={{ textAlign: 'right' as const }}>
                <Text style={itemPrice}>{currencySymbol}{amount}</Text>
              </Column>
            </Row>
            
            <Hr style={hr} />
            
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Total</Text>
              </Column>
              <Column style={{ textAlign: 'right' as const }}>
                <Text style={totalValue}>{currencySymbol}{amount}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={paymentDetails}>
            <Text style={subheading}>Payment Details</Text>
            <Text style={label}>Method:</Text>
            <Text style={value}>{paymentMethod}</Text>
            <Text style={label}>Status:</Text>
            <Text style={value}>{status}</Text>
            
            {status === 'Awaiting Payment' && (
                <Section style={bankBox}>
                    <Text style={{ ...label, color: '#2563eb' }}>Bank Transfer Instructions:</Text>
                    <Text style={bankValue}><strong>Bank:</strong> Zenith Bank</Text>
                    <Text style={bankValue}><strong>Account Name:</strong> GIA ADVISORY CONSULTING SERVICES</Text>
                    <Text style={bankValue}><strong>Account Number:</strong> 1229486016</Text>
                    <Text style={{ ...paragraph, fontSize: '13px', marginTop: '10px' }}>
                        Please use <strong>#{invoiceNumber}</strong> as your transfer reference and send proof of payment to accounts@giaadvisory.com
                    </Text>
                </Section>
            )}
          </Section>

          <Hr style={hr} />
          
          <Text style={footer}>
            If you have any questions, please contact our support team at info@giaadvisory.com
          </Text>
          <Text style={footer}>
            © 2026 GIA Advisory. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default CourseInvoiceEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 0",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const logo = {
  margin: "0 0 30px",
  display: "block",
};

const h1 = {
  color: "#1e293b",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "left" as const,
  margin: "30px 0",
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const paragraph = {
  color: "#475569",
  fontSize: "15px",
  lineHeight: "24px",
};

const subheading = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1e293b",
  margin: "20px 0 10px",
  textTransform: 'uppercase' as const,
};

const invoiceBox = {
  backgroundColor: "#f8fafc",
  padding: "24px",
  borderRadius: "16px",
  margin: "32px 0",
  border: '1px solid #e2e8f0',
};

const invoiceHeader = {
  marginBottom: '16px',
};

const invoiceLabel = {
  fontSize: "10px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  color: "#64748b",
  margin: "0",
};

const invoiceValue = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#1e293b",
  margin: "4px 0 0",
};

const itemRow = {
  padding: '12px 0',
};

const itemText = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#1e293b",
  margin: '0',
};

const itemPrice = {
  fontSize: "14px",
  color: "#475569",
  margin: '0',
};

const totalRow = {
  paddingTop: '12px',
};

const totalLabel = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1e293b",
};

const totalValue = {
  fontSize: "20px",
  fontWeight: "black",
  color: "#2563eb",
};

const paymentDetails = {
    margin: '32px 0',
};

const bankBox = {
    backgroundColor: '#eff6ff',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #dbeafe',
    marginTop: '16px',
};

const label = {
  fontSize: "11px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  color: "#64748b",
  margin: "0 0 4px",
};

const value = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#1e293b",
  margin: "0 0 16px",
};

const bankValue = {
  fontSize: "14px",
  color: "#1e293b",
  margin: "2px 0",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "24px 0",
};

const footer = {
  color: "#94a3b8",
  fontSize: "12px",
  lineHeight: "18px",
  textAlign: "center" as const,
  marginTop: '12px',
};
