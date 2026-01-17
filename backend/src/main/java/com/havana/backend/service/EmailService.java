package com.havana.backend.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Base64;


@Service
public class EmailService {

    private final String sendGridApiKey;
    private final String fromEmail;

    public EmailService(
            @Value("${sendgrid.api.key}") String sendGridApiKey,
            @Value("${sendgrid.from.email}") String fromEmail
    ) {
        this.sendGridApiKey = sendGridApiKey;
        this.fromEmail = fromEmail;
    }

    // ---------- OBIČAN MAIL ----------
    @Async
    public void sendMailKlijentu(String to, String subject, String text) {

        Email from = new Email(fromEmail);
        Email toEmail = new Email(to);
        Content content = new Content("text/plain", text);
        Mail mail = new Mail(from, subject, toEmail, content);

        send(mail);
    }

    // ---------- PDF SERVISERU ----------
    @Async
    public void sendPdfPredajeServiseru(
            String to,
            byte[] pdf,
            String subject,
            String text
    ) {
        sendMailWithAttachment(
                to,
                subject,
                text,
                pdf,
                "potvrda_predaje_vozila.pdf"
        );
    }

    // ---------- PDF KLIJENTU ----------
    @Async
    public void sendPdfPreuzimanjeKlijentu(
            String to,
            byte[] pdf,
            String subject,
            String text
    ) {
        sendMailWithAttachment(
                to,
                subject,
                text,
                pdf,
                "potvrda_preuzimanje_vozila.pdf"
        );
    }

    // ---------- CORE SENDGRID LOGIKA ----------

    private void sendMailWithAttachment(
            String to,
            String subject,
            String text,
            byte[] attachmentBytes,
            String filename
    ) {

        Email from = new Email(fromEmail);
        Email toEmail = new Email(to);
        Content content = new Content("text/plain", text);
        Mail mail = new Mail(from, subject, toEmail, content);

        Attachments attachments = new Attachments();
        attachments.setContent(
                Base64.getEncoder().encodeToString(attachmentBytes)
        );
        attachments.setType("application/pdf");
        attachments.setFilename(filename);
        attachments.setDisposition("attachment");

        mail.addAttachments(attachments);

        send(mail);
    }


    private void send(Mail mail) {
        try {
            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();

            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            if (response.getStatusCode() >= 400) {
                throw new RuntimeException(
                        "SendGrid error: " + response.getBody()
                );
            }

        } catch (Exception e) {
            throw new RuntimeException("Greška pri slanju maila preko SendGrid-a", e);
        }
    }
}
