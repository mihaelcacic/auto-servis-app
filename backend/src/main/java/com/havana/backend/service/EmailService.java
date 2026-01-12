package com.havana.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
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

    @Async
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
}
