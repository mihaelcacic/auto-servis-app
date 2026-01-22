package com.havana.backend.configuration;

import com.havana.backend.model.Klijent;
import com.havana.backend.repository.AdminRepository;
import com.havana.backend.repository.KlijentRepository;
import com.havana.backend.repository.ServiserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final KlijentRepository klijentRepository;
    private final ServiserRepository serviserRepository;
    private final AdminRepository adminRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest)
            throws OAuth2AuthenticationException {

        // ucitaj korisnika i dohvati podatke o korisniku sa googla
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        if (email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException("Email not provided by OAuth2 provider");
        }

        String ime = oAuth2User.getAttribute("given_name");
        if (ime == null) ime = "";

        String prezime = oAuth2User.getAttribute("family_name");
        if (prezime == null) prezime = "";

        String slikaUrl = oAuth2User.getAttribute("picture");

        // odredi ulogu korisnika ovisno u kojoj tablici u bazi se nalazi (prioriteti: admin, serviser, klijent)
        Role role;
        if (adminRepository.findByEmail(email) != null) {
            role = Role.ROLE_ADMIN;

        } else if (serviserRepository.findByEmail(email) != null) {
            role = Role.ROLE_SERVISER;

        } else {
            role = Role.ROLE_KLIJENT;

            // ako klijent ne postoji, kreiraj ga
            Klijent klijent = klijentRepository.findByEmail(email);
            if (klijent == null) {
                klijent = new Klijent(ime, prezime, email, slikaUrl);
                klijentRepository.save(klijent);
            }
        }

        // dodaj ulogu korisnkiu
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role.name()));
        // spremi ulogu uz principal
        return new DefaultOAuth2User(
                authorities,
                oAuth2User.getAttributes(),
                "email"
        );
    }
}