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

    public void sendPromjenaTermina(String to, long days){ /*metoda za slanje podsjetnika kod ažuriranja termina*/
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Promjena datuma termina");
        message.setText("Datum termina promijenjen je za "+ days +
                " dana.");

        mailSender.send(message);
    }

    public void sendPotvrdaPrijaveVozila(String to){ /*metoda za slanje maila kod stvaranja naloga*/
        SimpleMailMessage poruka = new SimpleMailMessage();

        // Postavi osnovne podatke maila
        poruka.setTo(to);
        poruka.setSubject("Potvrda registracije servisa - Bregmotors");

        // Sadržaj maila
        String tekst = """
            Poštovani,
            
            Vaša registracija servisa je zaprimljena. U tijeku je prihvaćanje Vašeg zahtjeva, te će se čim je prihvaćen, Vama na mail poslati Potvrda o predaji vozila.
            
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
    }//ako ce igdje biti problema, to je kod ove funkcije zbog importa i kak se koristi
     //pripazi kada budes deployo da ne zaboravis na ovu funkciju

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
    }//ista stvar i ovdje ako se naleti na error
}
