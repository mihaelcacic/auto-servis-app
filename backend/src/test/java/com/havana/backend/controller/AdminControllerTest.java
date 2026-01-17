package com.havana.backend.controller;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.havana.backend.model.Admin;
import com.havana.backend.model.Klijent;
import com.havana.backend.model.Nalog;
import com.havana.backend.model.Serviser;
import com.havana.backend.service.AdminService;
import com.havana.backend.service.KlijentService;
import com.havana.backend.service.NalogService;
import com.havana.backend.service.ServiserService;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    @InjectMocks
    private AdminController adminController;

    @Mock
    private AdminService adminService;

    @Mock
    private NalogService nalogService;

    @Mock
    private KlijentService klijentService;

    @Mock
    private ServiserService serviserService;

    //Redovni slučaj – kreiranje admina
    @Test
    void createAdmin_shouldReturnAdmin_whenValidInput() {
        Admin admin = new Admin();
        admin.setEmail("admin@test.com");

        when(adminService.createAdmin(admin)).thenReturn(admin);

        ResponseEntity<Admin> response = adminController.createAdmin(admin);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(admin, response.getBody());
        verify(adminService, times(1)).createAdmin(admin);
    }

    //Redovni slučaj – dohvat svih klijenata
    @Test
    void getSviKlijent_shouldReturnListOfClients() {
        List<Klijent> klijenti = List.of(new Klijent(), new Klijent());

        when(klijentService.findAll()).thenReturn(klijenti);

        ResponseEntity<List<Klijent>> response = adminController.getSviKlijent();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(klijentService, times(1)).findAll();
    }

    //Rubni uvjet – nema nijednog naloga
    @Test
    void getSviNalozi_shouldReturn404_whenNoNaloziExist() {
        when(nalogService.getSviNalozi()).thenReturn(List.of());

        ResponseEntity<?> response = adminController.getSviNalozi();

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    // Rubni uvjet – ažuriranje servisera s nepostojećim ID-jem
    @Test
    void updateServiser_shouldThrowException_whenServiserDoesNotExist() {
        Integer id = 99;
        Serviser serviser = new Serviser();

        when(adminService.updateServiser(id, serviser))
                .thenThrow(new RuntimeException("Serviser not found"));

        assertThrows(RuntimeException.class, () ->
                adminController.updateServiser(id, serviser)
        );
    }

    //Izazivanje pogreške – brisanje nepostojećeg naloga
    @Test
    void deleteNalog_shouldThrowException_whenNalogDoesNotExist() {
        Integer id = 50;

        doThrow(new RuntimeException("Nalog not found"))
                .when(nalogService).deleteNalog(id);

        assertThrows(RuntimeException.class, () ->
                adminController.deleteNalog(id)
        );
    }

    //Redovni slučaj – dohvat svih servisera
    @Test
    void getSviServiser_shouldReturnListOfServisers() {
        List<Serviser> serviseri = List.of(new Serviser());

        when(serviserService.findAllServisere()).thenReturn(serviseri);

        ResponseEntity<List<Serviser>> response = adminController.getSviServiser();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(serviserService, times(1)).findAllServisere();
    }
}
