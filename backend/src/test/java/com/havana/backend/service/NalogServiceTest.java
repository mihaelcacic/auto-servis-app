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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
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

    // Redovni slučaj - kreiran nalog sa svim parametrima ispunjenim
    @Test
    void createNewNalog_shouldReturnTrue_whenAllDataValid() {

        Klijent klijent = new Klijent();
        klijent.setEmail("test@test.com");

        Vozilo vozilo = new Vozilo();
        vozilo.setRegistracija("ZG1234");

        ZamjenskoVozilo zv = new ZamjenskoVozilo();

        when(klijentRepository.findById(1)).thenReturn(Optional.of(klijent));
        when(voziloRepository.findByRegistracija("ZG1234"))
                .thenReturn(Optional.of(vozilo));
        when(uslugeRepository.findById(1))
                .thenReturn(Optional.of(new Usluge()));
        when(serviserRepository.findById(1))
                .thenReturn(Optional.of(new Serviser()));
        when(zamjenskoVoziloRepository.findById(5))
                .thenReturn(Optional.of(zv));

        NalogRecord record = new NalogRecord(
                1,
                new VoziloRecord("ZG1234", 2020, 1),
                List.of(1),
                1,
                5,
                LocalDateTime.now().plusDays(1),
                1,
                "Napomena"
        );

        boolean result = nalogService.createNewNalog(record);

        assertTrue(result);
        verify(nalogRepository, times(1)).save(any(Nalog.class));
        verify(emailService, times(1))
                .sendMailKlijentu(anyString(), anyString(), anyString());
    }

    // Redovni slučaj- nalog gdje zamjensko vozilo = null
    @Test
    void createNewNalog_shouldWork_whenNoZamjenskoVozilo() {

        when(klijentRepository.findById(any()))
                .thenReturn(Optional.of(new Klijent()));
        when(voziloRepository.findByRegistracija(any()))
                .thenReturn(Optional.of(new Vozilo()));
        when(uslugeRepository.findById(any()))
                .thenReturn(Optional.of(new Usluge()));
        when(serviserRepository.findById(any()))
                .thenReturn(Optional.of(new Serviser()));

        NalogRecord record = new NalogRecord(
                1,
                new VoziloRecord("ST9999", 2019, 1),
                List.of(1),
                1,
                null,
                LocalDateTime.now().plusDays(1),
                1,
                null
        );

        assertTrue(nalogService.createNewNalog(record));
    }


    // Rubni slučaj - klijent ne postoji
    @Test
    void createNewNalog_shouldReturnFalse_whenKlijentNotFound() {

        when(klijentRepository.findById(any()))
                .thenReturn(Optional.empty());

        NalogRecord record = new NalogRecord(
                99,
                new VoziloRecord("ZG0000", 2020, 1),
                List.of(1),
                1,
                null,
                LocalDateTime.now().plusDays(1),
                1,
                null
        );

        boolean result = nalogService.createNewNalog(record);

        assertFalse(result);
    }

    // Rubni slučaj - model ne postoji (novo vozilo)
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
                List.of(1),
                1,
                null,
                LocalDateTime.now().plusDays(1),
                1,
                null
        );

        assertFalse(nalogService.createNewNalog(record));
    }

    // Rubni slučaj - termin u prošlosti
    @Test
    void createNewNalog_shouldReturnFalse_whenTerminInPast() {

        NalogRecord record = new NalogRecord(
                1,
                new VoziloRecord("ZG1111", 2020, 1),
                List.of(1),
                1,
                null,
                LocalDateTime.now().minusDays(1),
                1,
                null
        );

        boolean result = nalogService.createNewNalog(record);

        assertFalse(result);
    }


    //Rubni slučaj - sakrijNalog kad je nepostojeći ID
    @Test
    void sakrijNalog_shouldThrowException_whenNalogDoesNotExist() {

        when(nalogRepository.findById(1))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> nalogService.sakrijNalog(1));
    }

    // Redovni slučaj - sakrij nalog bez
    @Test
    void sakrijNalog_shouldHideNalog() {

        Nalog nalog = new Nalog();
        nalog.setSakriven(false);

        when(nalogRepository.findById(1))
                .thenReturn(Optional.of(nalog));

        nalogService.sakrijNalog(1);

        assertTrue(nalog.getSakriven());
        verify(nalogRepository, times(1)).save(nalog);
    }
}
