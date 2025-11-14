package com.havana.backend.configuration;

import com.havana.backend.model.Klijent;
import com.havana.backend.repository.KlijentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final KlijentRepository klijentRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String slikaUrl = oAuth2User.getAttribute("picture");
        String imeKlijent = oAuth2User.getAttribute("given_name");
        String prezimeKlijent = oAuth2User.getAttribute("family_name");

        // proncadi email, ako postoji nemoj ga opet spremati
        Klijent klijent = klijentRepository.findByEmail(email);
        if (klijent == null) {
            klijent = new Klijent(imeKlijent, prezimeKlijent, email, slikaUrl);
            klijentRepository.save(klijent);
        }

        return oAuth2User;
    }

}
