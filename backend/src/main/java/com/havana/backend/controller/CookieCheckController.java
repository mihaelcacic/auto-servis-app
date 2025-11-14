package com.havana.backend.controller;

import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class CookieCheckController {

    @GetMapping("/cookie-check")
    public ResponseEntity<String> check() {
        ResponseCookie cookie = ResponseCookie.from("thirdPartyTest", "yes")
                .httpOnly(false)
                .secure(true)
                .path("/")
                .sameSite("None")
                .build();
        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body("ok");
    }

    @GetMapping("/cookie-check-status")
    public Map<String, Boolean> status(@CookieValue(value = "thirdPartyTest", defaultValue = "no") String test) {
        return Map.of("cookieSet", test.equals("yes"));
    }
}