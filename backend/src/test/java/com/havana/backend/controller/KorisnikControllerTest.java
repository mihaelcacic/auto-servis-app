package com.havana.backend.controller;

import com.havana.backend.data.KorisnikRecord;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class KorisnikControllerTest {

    @InjectMocks
    private KorisnikController korisnikController;

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private ServiserRepository serviserRepository;

    @Mock
    private KlijentRepository klijentRepository;

    @Test
    void getCurrentUser_shouldReturnUnauthorized_whenPrincipalIsNull() {
        ResponseEntity<?> response = korisnikController.getCurrentUser(null);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void getCurrentUser_shouldReturnAdmin_whenRoleAdmin() {
        OAuth2User principal = mock(OAuth2User.class);
        when(principal.getAttribute("email")).thenReturn("admin@test.com");
        when(principal.getAttribute("picture")).thenReturn("slika.png");

        Collection<GrantedAuthority> authorities = List.of(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return "ROLE_ADMIN";
            }
        });
        when(principal.getAuthorities()).thenAnswer(invocation -> authorities);

        Admin admin = new Admin();
        admin.setIdAdmin(1);
        admin.setImeAdmin("Ivan");
        admin.setPrezimeAdmin("Ivić");
        admin.setEmail("admin@test.com");

        when(adminRepository.findByEmail("admin@test.com")).thenReturn(admin);

        ResponseEntity<?> response = korisnikController.getCurrentUser(principal);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        KorisnikRecord record = (KorisnikRecord) response.getBody();
        assertNotNull(record);
        assertEquals("Ivan", record.ime());
        assertEquals("ROLE_ADMIN", record.role());
    }

    @Test
    void getCurrentUser_shouldReturnServiser_whenRoleServiser() {
        OAuth2User principal = mock(OAuth2User.class);
        when(principal.getAttribute("email")).thenReturn("serviser@test.com");
        when(principal.getAttribute("picture")).thenReturn("slika.png");

        Collection<GrantedAuthority> authorities = List.of(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return "ROLE_SERVISER";
            }
        });
        when(principal.getAuthorities()).thenAnswer(invocation -> authorities);

        Serviser serviser = new Serviser();
        serviser.setIdServiser(2);
        serviser.setImeServiser("Marko");
        serviser.setPrezimeServiser("Markić");
        serviser.setEmail("serviser@test.com");

        when(serviserRepository.findByEmail("serviser@test.com")).thenReturn(serviser);

        ResponseEntity<?> response = korisnikController.getCurrentUser(principal);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        KorisnikRecord record = (KorisnikRecord) response.getBody();
        assertEquals("Marko", record.ime());
        assertEquals("ROLE_SERVISER", record.role());
    }

    @Test
    void getCurrentUser_shouldReturnKlijent_whenDefaultRole() {
        OAuth2User principal = mock(OAuth2User.class);
        when(principal.getAttribute("email")).thenReturn("klijent@test.com");
        when(principal.getAttribute("picture")).thenReturn("slika.png");

        Collection<GrantedAuthority> authorities = List.of(); // prazno → fallback na ROLE_KLIJENT
        when(principal.getAuthorities()).thenAnswer(invocation -> authorities);

        Klijent klijent = new Klijent();
        klijent.setIdKlijent(3);
        klijent.setImeKlijent("Ana");
        klijent.setPrezimeKlijent("Anić");
        klijent.setEmail("klijent@test.com");

        when(klijentRepository.findByEmail("klijent@test.com")).thenReturn(klijent);

        ResponseEntity<?> response = korisnikController.getCurrentUser(principal);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        KorisnikRecord record = (KorisnikRecord) response.getBody();
        assertEquals("Ana", record.ime());
        assertEquals("ROLE_KLIJENT", record.role());
    }

    @Test
    void getCurrentUser_shouldHandleUnknownRole_asKlijent() {
        OAuth2User principal = mock(OAuth2User.class);
        when(principal.getAttribute("email")).thenReturn("klijent2@test.com");
        when(principal.getAttribute("picture")).thenReturn("slika.png");

        Collection<GrantedAuthority> authorities = List.of(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return "ROLE_UNKNOWN";
            }
        });
        when(principal.getAuthorities()).thenAnswer(invocation -> authorities);

        Klijent klijent = new Klijent();
        klijent.setIdKlijent(4);
        klijent.setImeKlijent("Luka");
        klijent.setPrezimeKlijent("Lukić");
        klijent.setEmail("klijent2@test.com");

        when(klijentRepository.findByEmail("klijent2@test.com")).thenReturn(klijent);

        ResponseEntity<?> response = korisnikController.getCurrentUser(principal);
        KorisnikRecord record = (KorisnikRecord) response.getBody();

        assertEquals("Luka", record.ime());
        assertEquals("ROLE_UNKNOWN", record.role());
    }

}
