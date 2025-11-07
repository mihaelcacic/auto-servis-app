package com.havana.backend.service;

import com.havana.backend.model.User;
import com.havana.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        // Razdvajanje imena i prezimena ako postoji
        String firstName = oAuth2User.getAttribute("given_name");
        String lastName = oAuth2User.getAttribute("family_name");

        if (firstName == null || lastName == null) {
            String fullName = oAuth2User.getAttribute("name");
            if (fullName != null) {
                String[] parts = fullName.split(" ", 2);
                firstName = parts[0];
                if (parts.length > 1) lastName = parts[1];
                else lastName = "";
            } else {
                firstName = "";
                lastName = "";
            }
        }

        String finalFirstName = firstName;
        String finalLastName = lastName;
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFirstName(finalFirstName);
            newUser.setLastName(finalLastName);
            newUser.setPictureUrl(picture);
            return userRepository.save(newUser);
        });

        // update user info if changed
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPictureUrl(picture);

        userRepository.save(user);

        return oAuth2User;
    }

}
