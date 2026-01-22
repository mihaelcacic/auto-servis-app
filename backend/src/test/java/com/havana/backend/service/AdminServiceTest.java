package com.havana.backend.service;

import com.havana.backend.model.Admin;
import com.havana.backend.model.Klijent;
import com.havana.backend.model.Serviser;
import com.havana.backend.repository.AdminRepository;
import com.havana.backend.repository.KlijentRepository;
import com.havana.backend.repository.ServiserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private ServiserRepository serviserRepository;

    @Mock
    private KlijentRepository klijentRepository;

    @Mock
    private AdminRepository adminRepository;

    @InjectMocks
    private AdminService adminService;


    //Redovni slučaj - createServiser
    @Test
    void createServiser_shouldSaveAndReturnServiser() {
        Serviser serviser = new Serviser();
        serviser.setImeServiser("Ivan");

        when(serviserRepository.save(serviser)).thenReturn(serviser);

        Serviser result = adminService.createServiser(serviser);

        assertNotNull(result);
        assertEquals("Ivan", result.getImeServiser());
        verify(serviserRepository, times(1)).save(serviser);
    }

    // Redovni slučaj - updateServiser
    @Test
    void updateServiser_shouldUpdateAndReturnServiser_whenExists() {
        Serviser existing = new Serviser();
        existing.setImeServiser("Staro");

        Serviser updated = new Serviser();
        updated.setImeServiser("Novo");
        updated.setPrezimeServiser("Prezime");
        updated.setEmail("novo@test.com");
        updated.setVoditeljServisa(true);

        when(serviserRepository.findById(1)).thenReturn(Optional.of(existing));
        when(serviserRepository.save(any(Serviser.class))).thenReturn(existing);

        Serviser result = adminService.updateServiser(1, updated);

        assertEquals("Novo", result.getImeServiser());
        assertEquals("novo@test.com", result.getEmail());
        assertTrue(result.isVoditeljServisa());
    }

    //Rubni slučaj - updateServiser kada serviser ne postoji
    @Test
    void updateServiser_shouldThrowException_whenServiserNotFound() {
        when(serviserRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> adminService.updateServiser(1, new Serviser()));
    }

    //Redovni slučaj - updateKlijent
    @Test
    void updateKlijent_shouldUpdateAndReturnKlijent_whenExists() {
        Klijent existing = new Klijent();
        existing.setImeKlijent("Marko");

        Klijent updated = new Klijent();
        updated.setImeKlijent("Ivan");
        updated.setPrezimeKlijent("Ivić");
        updated.setEmail("ivan@test.com");
        updated.setSlikaUrl("img.png");

        when(klijentRepository.findById(2)).thenReturn(Optional.of(existing));
        when(klijentRepository.save(any(Klijent.class))).thenReturn(existing);

        Klijent result = adminService.updateKlijent(2, updated);

        assertEquals("Ivan", result.getImeKlijent());
        assertEquals("ivan@test.com", result.getEmail());
    }

    //Rubni slučaj - updateKlijent kada klijent ne postoji
    @Test
    void updateKlijent_shouldThrowException_whenKlijentNotFound() {
        when(klijentRepository.findById(2)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> adminService.updateKlijent(2, new Klijent()));
    }

    // Redovni slučaj - createAdmin
    @Test
    void createAdmin_shouldSaveAndReturnAdmin() {
        Admin admin = new Admin();
        admin.setEmail("admin@test.com");

        when(adminRepository.save(admin)).thenReturn(admin);

        Admin result = adminService.createAdmin(admin);

        assertNotNull(result);
        assertEquals("admin@test.com", result.getEmail());
        verify(adminRepository, times(1)).save(admin);
    }
}
