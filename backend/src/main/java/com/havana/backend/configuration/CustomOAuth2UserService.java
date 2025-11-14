package com.havana.backend.configuration;

import com.havana.backend.model.Klijent;
import com.havana.backend.repository.KlijentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final KlijentRepository klijentRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Sigurno čitanje atributa (Google ne garantira da postoje)
        String email = oAuth2User.getAttribute("email");
        String slikaUrl = oAuth2User.getAttribute("picture");

        String imeKlijent = oAuth2User.getAttribute("given_name");
        if (imeKlijent == null) imeKlijent = "";  // fallback

        String prezimeKlijent = oAuth2User.getAttribute("family_name");
        if (prezimeKlijent == null) prezimeKlijent = ""; // fallback

        // Email je OBAVEZAN za identifikaciju – bez njega prekid
        if (email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException("Google account does not provide email.");
        }

        // Provjeri postoji li korisnik u bazi
        Klijent klijent = klijentRepository.findByEmail(email);

        if (klijent == null) {
            // stvori novog
            klijent = new Klijent(imeKlijent, prezimeKlijent, email, slikaUrl);
            klijentRepository.save(klijent);
        }

        // Vrati OAuth2User s originalnim atributima i rolama (ako ih koristiš)
        return oAuth2User;
    }


}
