package com.havana.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Potvrda prijave vozila");
        message.setText("Vaše vozilo uspješno je prijavljeno na servis!");
        mailSender.send(message);
    }
}
