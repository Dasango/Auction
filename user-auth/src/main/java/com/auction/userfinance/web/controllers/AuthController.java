package com.auction.userfinance.web.controllers;

import com.auction.userfinance.services.AppUserService;
import com.auction.userfinance.services.dtos.AppUserDtos;
import com.auction.userfinance.web.security.JwtUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AppUserService appUserService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AppUserDtos.SignUpRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );
        String token = jwtUtils.generateToken(authentication.getName());
        return ResponseEntity.ok(token);
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody @Valid AppUserDtos.SignUpRequest request) {

        appUserService.createUser(request);

        return ResponseEntity.status(HttpStatus.CREATED).body("Usuario registrado con éxito");
    }
}