package com.havana.backend.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPotvrdaPrijaveVozila(String to){ /*metoda za slanje maila kod stvaranja naloga*/
        SimpleMailMessage poruka = new SimpleMailMessage();

        // Postavi osnovne podatke maila
        poruka.setTo(to);
        poruka.setSubject("Potvrda registracije servisa - Bregmotors");

        // Sadržaj maila
        String tekst = """
            Poštovani,
            
            Vaša registracija servisa je zaprimljena. Dođite čim prije u našu poslovnicu kako bi mogli krenuti sa servisom Vašeg vozila!
            
            Vaš Bregmotors
            """;

        poruka.setText(tekst);

        // Pošalji mail
        mailSender.send(poruka);
    }

    //tu moram dodat metodu koja šalje određeni mail kada se pritisne jedan od endpointova, ovo ćemo kasnije

    public void sendPdfServiseru(
            String to,
            byte[] pdf,
            String subject,
            String text
    ) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text);

            helper.addAttachment(
                    "potvrda_preuzimanje.pdf",
                    new ByteArrayResource(pdf)
            );

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Greška pri slanju maila", e);
        }
    }

    public void sendPdfKlijentu(
            String to,
            byte[] pdf,
            String subject,
            String text
    ) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text);

            helper.addAttachment(
                    "potvrda_preuzimanje_vozila.pdf",
                    new ByteArrayResource(pdf)
            );

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Greška pri slanju maila klijentu", e);
        }
    }

    public void sendMailKlijentu(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
    }

}
