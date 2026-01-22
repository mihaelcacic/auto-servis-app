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

    // obican generic template funkcija u koju se salju svi podatci o mailu te se koriste ostale generic metode za daljnje slanje
    @Async
    public void sendMailKlijentu(String to, String subject, String text) {

        // pridodavanje contenta i maila varijablama koje ce se koristiti u generic send
        Email from = new Email(fromEmail);
        Email toEmail = new Email(to);
        Content content = new Content("text/plain", text);
        Mail mail = new Mail(from, subject, toEmail, content);

        // poziv generic funk send
        send(mail);
    }

    // saljemo isto pdf klijentu ali je typo
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

    @Async
    public void sendPdfPreuzimanjeKlijentu(
            String to,
            byte[] pdf,
            String subject,
            String text
    ) {
        // dobili smo sve podatke nuzne za mail u pozivamo lokalnu funkciju za njeno slanje
        sendMailWithAttachment(
                to,
                subject,
                text,
                pdf,
                "potvrda_preuzimanje_vozila.pdf"
        );
    }


    private void sendMailWithAttachment(
            String to,
            String subject,
            String text,
            byte[] attachmentBytes,
            String filename
    ) {

        // namjestavamo strukturu maila te dodajemo attachment na mail
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

        // dodajemo pdf u mail
        mail.addAttachments(attachments);

        // koristenje generic funkcije za slanje
        send(mail);
    }


    private void send(Mail mail) {
        try {

            // koristimo sendgrid kako bi napravili post req te poslali mail preko njega
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
