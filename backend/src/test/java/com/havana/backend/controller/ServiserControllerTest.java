package com.havana.backend.controller;

import com.havana.backend.model.Nalog;
import com.havana.backend.data.UpdateTerminRequestRecord;
import com.havana.backend.service.ServiserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServiserControllerTest {

    @InjectMocks
    private ServiserController serviserController;

    @Mock
    private ServiserService serviserService;

    //dohvat naloga
    @Test
    void getMyNalozi_shouldReturnList() {
        OAuth2User principal = mock(OAuth2User.class);
        when(principal.getAttribute("email")).thenReturn("serviser@test.com");

        Nalog nalog = new Nalog();
        when(serviserService.getNaloziByServiserEmail("serviser@test.com"))
                .thenReturn(List.of(nalog));

        ResponseEntity<List<Nalog>> response = serviserController.getMyNalozi(principal);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    //principal null
    @Test
    void getMyNalozi_shouldReturnUnauthorized_whenPrincipalNull() {
        ResponseEntity<List<Nalog>> response = serviserController.getMyNalozi(null);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());
    }

    //update status
    @Test
    void updateStatus_shouldCallServiceAndReturnOk() throws Exception {
        OAuth2User principal = mock(OAuth2User.class);
        when(principal.getAttribute("email")).thenReturn("serviser@test.com");

        ResponseEntity<Void> response = serviserController.updateStatus(1, 2, principal);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(serviserService, times(1)).updateNalogStatus(1, 2, "serviser@test.com");
    }

    // update status with service throwing
    @Test
    void updateStatus_shouldPropagateException() throws Exception {
        OAuth2User principal = mock(OAuth2User.class);
        when(principal.getAttribute("email")).thenReturn("serviser@test.com");

        doThrow(new RuntimeException("Nalog nije pronađen"))
                .when(serviserService).updateNalogStatus(1, 2, "serviser@test.com");

        Exception exception = assertThrows(RuntimeException.class, () ->
                serviserController.updateStatus(1, 2, principal)
        );
        assertEquals("Nalog nije pronađen", exception.getMessage());
    }

    //download PDF preuzimanje
    @Test
    void downloadPotvrdaOPreuzimanju_shouldReturnPdf() throws Exception {
        OAuth2User principal = mock(OAuth2User.class);
        when(principal.getAttribute("email")).thenReturn("serviser@test.com");

        byte[] pdfBytes = new byte[]{1, 2, 3};
        when(serviserService.getPotvrdaOPreuzimanju(1, "serviser@test.com")).thenReturn(pdfBytes);

        ResponseEntity<byte[]> response = serviserController.downloadPotvrdaOPreuzimanju(1, principal);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertArrayEquals(pdfBytes, response.getBody());
        assertTrue(response.getHeaders().getContentDisposition().getFilename().contains("potvrda_preuzimanje"));
    }

    // notify servis završen s null principal
    @Test
    void notifyServisZavrsen_shouldReturnUnauthorized_whenPrincipalNull() throws Exception {
        ResponseEntity<Void> response = serviserController.notifyServisZavrsen(1, null);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());
    }
}
