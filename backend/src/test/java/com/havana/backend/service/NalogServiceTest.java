package com.havana.backend.service;

import com.havana.backend.data.NalogRecord;
import com.havana.backend.data.VoziloRecord;
import com.havana.backend.model.*;
import com.havana.backend.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NalogServiceTest {

    @InjectMocks
    private NalogService nalogService;

    @Mock private NalogRepository nalogRepository;
    @Mock private KlijentRepository klijentRepository;
    @Mock private VoziloRepository voziloRepository;
    @Mock private ModelRepository modelRepository;
    @Mock private UslugeRepository uslugeRepository;
    @Mock private ServiserRepository serviserRepository;
    @Mock private ZamjenskoVoziloRepository zamjenskoVoziloRepository;
    @Mock private EmailService emailService;


    //Redovni slučaj

    @Test
    void createNewNalog_shouldReturnTrue_whenAllDataValid() {

        Klijent klijent = new Klijent();
        klijent.setEmail("test@test.com");

        Vozilo vozilo = new Vozilo();
        vozilo.setRegistracija("ZG1234");

        when(klijentRepository.findById(1)).thenReturn(Optional.of(klijent));
        when(voziloRepository.findByRegistracija("ZG1234"))
                .thenReturn(Optional.of(vozilo));
        when(uslugeRepository.findById(1)).thenReturn(Optional.of(new Usluge()));
        when(serviserRepository.findById(1)).thenReturn(Optional.of(new Serviser()));

        NalogRecord record = new NalogRecord(
                1,
                new VoziloRecord("ZG1234", 2020, 1),
                1,
                1,
                null,
                LocalDateTime.now(),
                1,
                "Napomena"
        );

        boolean result = nalogService.createNewNalog(record);

        assertTrue(result);
        verify(nalogRepository, times(1)).save(any(Nalog.class));
        verify(emailService, times(1)).sendMailKlijentu(
                anyString(), anyString(), anyString()
        );
    }


    // Zamjensko vozilo = null

    @Test
    void createNewNalog_shouldWork_whenNoZamjenskoVozilo() {

        when(klijentRepository.findById(any())).thenReturn(Optional.of(new Klijent()));
        when(voziloRepository.findByRegistracija(any()))
                .thenReturn(Optional.of(new Vozilo()));
        when(uslugeRepository.findById(any())).thenReturn(Optional.of(new Usluge()));
        when(serviserRepository.findById(any())).thenReturn(Optional.of(new Serviser()));

        NalogRecord record = new NalogRecord(
                1,
                new VoziloRecord("ST9999", 2019, 1),
                1,
                1,
                null,
                LocalDateTime.now(),
                1,
                null
        );

        assertTrue(nalogService.createNewNalog(record));
    }


    //Klijent ne postoji

    @Test
    void createNewNalog_shouldReturnFalse_whenKlijentNotFound() {

        when(klijentRepository.findById(any()))
                .thenReturn(Optional.empty());

        NalogRecord record = new NalogRecord(
                99,
                new VoziloRecord("ZG0000", 2020, 1),
                1,
                1,
                null,
                LocalDateTime.now(),
                1,
                null
        );

        boolean result = nalogService.createNewNalog(record);

        assertFalse(result);
    }

    //Model ne postoji (novo vozilo)

    @Test
    void createNewNalog_shouldReturnFalse_whenModelNotFound() {

        when(klijentRepository.findById(any()))
                .thenReturn(Optional.of(new Klijent()));
        when(voziloRepository.findByRegistracija(any()))
                .thenReturn(Optional.empty());
        when(modelRepository.findById(any()))
                .thenReturn(Optional.empty());

        NalogRecord record = new NalogRecord(
                1,
                new VoziloRecord("RI1234", 2022, 99),
                1,
                1,
                null,
                LocalDateTime.now(),
                1,
                null
        );

        assertFalse(nalogService.createNewNalog(record));
    }


    //Zamjensko vozilo zauzeto

    @Test
    void createNewNalog_shouldReturnFalse_whenZamjenskoVoziloAlreadyTaken() {

        ZamjenskoVozilo zv = new ZamjenskoVozilo();
        zv.setDatumPreuzimanja(LocalDateTime.now().toLocalDate());

        when(klijentRepository.findById(any()))
                .thenReturn(Optional.of(new Klijent()));
        when(voziloRepository.findByRegistracija(any()))
                .thenReturn(Optional.of(new Vozilo()));
        when(uslugeRepository.findById(any()))
                .thenReturn(Optional.of(new Usluge()));
        when(serviserRepository.findById(any()))
                .thenReturn(Optional.of(new Serviser()));
        when(zamjenskoVoziloRepository.findById(any()))
                .thenReturn(Optional.of(zv));

        NalogRecord record = new NalogRecord(
                1,
                new VoziloRecord("OS5555", 2021, 1),
                1,
                1,
                1,
                LocalDateTime.now(),
                1,
                null
        );

        assertFalse(nalogService.createNewNalog(record));
    }

    // deleteNalog za nepostojeći ID

    @Test
    void deleteNalog_shouldThrowException_whenNalogDoesNotExist() {

        when(nalogRepository.existsById(1)).thenReturn(false);

        assertThrows(RuntimeException.class,
                () -> nalogService.deleteNalog(1));
    }
}
