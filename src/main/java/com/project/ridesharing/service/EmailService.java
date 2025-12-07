package com.project.ridesharing.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendDriverBookingAlert(String driverEmail, String driverName, String passengerName,
                                       String source, String destination, int seats, String date, String time) {
        String subject = "New Booking Alert - ShareWheels";
        String content = generateHtmlTemplate(
                "New Passenger Confirmed!",
                "Hello " + driverName + ",",
                "Good news! A passenger has booked a seat on your ride.",
                passengerName, source, destination, seats + " Seat(s)", date + " at " + time,
                "Please be on time at the pickup location."
        );
        sendHtmlEmail(driverEmail, subject, content);
    }

    public void sendPassengerBookingConfirmation(String passengerEmail, String passengerName, String driverName,
                                                 String source, String destination, int seats, double amount,
                                                 String vehicleModel, String vehiclePlate, String date, String time) {

        String formattedAmount = String.valueOf((int) Math.round(amount));
        String subject = "Booking Confirmed - ShareWheels";
        String content = generateHtmlTemplate(
                "Your Ride is Booked!",
                "Hello " + passengerName + ",",
                "Your booking with <b>" + driverName + "</b> is confirmed.",
                driverName + " (" + vehicleModel + " - " + vehiclePlate + ")",
                source, destination, seats + " Seat(s)", date + " at " + time,
                "Total Fare Paid: <b>₹" + formattedAmount + "</b>. Have a safe journey!"
        );
        sendHtmlEmail(passengerEmail, subject, content);
    }

    public void sendOtpEmail(String toEmail, String otp) {
        String subject = "Your OTP Code - ShareWheels";
        String content = "<html><body style='font-family: Arial, sans-serif;'>"
                + "<h2>Your Verification Code</h2>"
                + "<h1>" + otp + "</h1>"
                + "<p>This code is valid for 10 minutes.</p>"
                + "</body></html>";
        sendHtmlEmail(toEmail, subject, content);
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            System.out.println("Email sent successfully to: " + to);
        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    private String generateHtmlTemplate(String title, String greeting, String mainMessage,
                                        String nameField, String from, String to, String seats, String dateTime, String footerMsg) {
        return """
            <html>
            <body style='font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;'>
                <div style='max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>
                    
                    <div style='background-color: #3b82f6; padding: 20px; text-align: center; color: #ffffff;'>
                        <h1 style='margin: 0; font-size: 24px;'>ShareWheels</h1>
                        <p style='margin: 5px 0 0; opacity: 0.9;'>""" + title + """
                        </p>
                    </div>

                    <div style='padding: 30px; color: #333333;'>
                        <p style='font-size: 16px; margin-bottom: 20px;'>""" + greeting + """
                        </p>
                        <p style='font-size: 16px; line-height: 1.5; margin-bottom: 30px;'>
                            """ + mainMessage + """
                        </p>

                        <div style='background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;'>
                            <table style='width: 100%; border-collapse: collapse;'>
                                <tr>
                                    <td style='padding: 8px 0; color: #64748b; font-size: 12px; text-transform: uppercase;'>Person</td>
                                    <td style='padding: 8px 0; font-weight: bold; text-align: right;'>""" + nameField + """
                                    </td>
                                </tr>
                                <tr style='border-top: 1px solid #e2e8f0;'>
                                    <td style='padding: 8px 0; color: #64748b; font-size: 12px; text-transform: uppercase;'>From</td>
                                    <td style='padding: 8px 0; font-weight: bold; text-align: right;'>""" + from + """
                                    </td>
                                </tr>
                                <tr style='border-top: 1px solid #e2e8f0;'>
                                    <td style='padding: 8px 0; color: #64748b; font-size: 12px; text-transform: uppercase;'>To</td>
                                    <td style='padding: 8px 0; font-weight: bold; text-align: right;'>""" + to + """
                                    </td>
                                </tr>
                                <tr style='border-top: 1px solid #e2e8f0;'>
                                    <td style='padding: 8px 0; color: #64748b; font-size: 12px; text-transform: uppercase;'>Seats & Time</td>
                                    <td style='padding: 8px 0; font-weight: bold; text-align: right;'>""" + seats + " | " + dateTime + """
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <p style='margin-top: 30px; font-size: 14px; color: #64748b; text-align: center;'>
                            """ + footerMsg + """
                        </p>
                    </div>

                    <div style='background-color: #1e293b; padding: 15px; text-align: center; color: #94a3b8; font-size: 12px;'>
                        <p style='margin: 0;'>© 2025 ShareWheels Inc. Need help? Contact support.</p>
                    </div>
                </div>
            </body>
            </html>
        """;
    }
}