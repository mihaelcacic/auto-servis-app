package com.havana.backend.service;

import com.havana.backend.model.*;
import com.havana.backend.repository.NalogRepository;
import com.havana.backend.repository.ServiserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServiserServiceTest {

    @Mock
    private ServiserRepository serviserRepository;

    @Mock
    private NalogRepository nalogRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private PDFExportService pdfExportService;

    @InjectMocks
    private ServiserService serviserService;

    //findAllServisere – redovni
    @Test
    void findAllServisere_shouldReturnList() {
        when(serviserRepository.findAllServisere())
                .thenReturn(List.of(new Serviser(), new Serviser()));

        List<Serviser> result = serviserService.findAllServisere();

        assertEquals(2, result.size());
    }

    //getNaloziByServiserEmail – redovni
    @Test
    void getNaloziByServiserEmail_shouldReturnNalozi() {
        Serviser serviser = new Serviser();
        serviser.setIdServiser(1);

        when(serviserRepository.findByEmail("test@test.com"))
                .thenReturn(serviser);
        when(nalogRepository.findByServiser_IdServiserAndSakrivenFalse(1))
                .thenReturn(List.of(new Nalog()));

        List<Nalog> result =
                serviserService.getNaloziByServiserEmail("test@test.com");

        assertEquals(1, result.size());
    }

    //updateNalogStatus – access denied
    @Test
    void updateNalogStatus_shouldThrowAccessDenied_whenWrongServiser() {
        Serviser drugi = new Serviser();
        drugi.setIdServiser(2);

        Serviser pravi = new Serviser();
        pravi.setIdServiser(1);

        Nalog nalog = new Nalog();
        nalog.setServiser(pravi);

        when(nalogRepository.findById(1)).thenReturn(Optional.of(nalog));
        when(serviserRepository.findByEmail("serv@test.com"))
                .thenReturn(drugi);

        assertThrows(AccessDeniedException.class,
                () -> serviserService.updateNalogStatus(1, 1, "serv@test.com"));
    }

    //updateNapomena – redovni
    @Test
    void updateNapomena_shouldUpdate_whenAuthorized() throws Exception {
        Serviser serviser = new Serviser();
        serviser.setIdServiser(1);

        Nalog nalog = new Nalog();
        nalog.setServiser(serviser);

        when(nalogRepository.findById(1)).thenReturn(Optional.of(nalog));
        when(serviserRepository.findByEmail("serv@test.com"))
                .thenReturn(serviser);

        serviserService.updateNapomena(1, "Nova napomena", "serv@test.com");

        assertEquals("Nova napomena", nalog.getNapomena());
        verify(nalogRepository).save(nalog);
    }


    //getPotvrdaOPreuzimanju – servis završen (exception)
    @Test
    void getPotvrdaOPreuzimanju_shouldThrow_whenServiceFinished() {
        Serviser serviser = new Serviser();
        serviser.setIdServiser(1);

        Nalog nalog = new Nalog();
        nalog.setServiser(serviser);
        nalog.setStatus(2);

        when(nalogRepository.findById(1)).thenReturn(Optional.of(nalog));
        when(serviserRepository.findByEmail("serv@test.com"))
                .thenReturn(serviser);

        assertThrows(IllegalStateException.class,
                () -> serviserService.getPotvrdaOPreuzimanju(1, "serv@test.com"));
    }


    //updateTerminServisa – termin u prošlosti
    @Test
    void updateTerminServisa_shouldThrow_whenInPast() {
        Serviser serviser = new Serviser();
        serviser.setEmail("serv@test.com");

        Nalog nalog = new Nalog();
        nalog.setServiser(serviser);
        nalog.setStatus(1);
        nalog.setDatumVrijemeTermin(LocalDateTime.now().plusDays(1));

        when(nalogRepository.findById(1)).thenReturn(Optional.of(nalog));

        assertThrows(IllegalArgumentException.class,
                () -> serviserService.updateTerminServisa(
                        1,
                        "serv@test.com",
                        LocalDateTime.now().minusDays(1)
                ));
    }
}
