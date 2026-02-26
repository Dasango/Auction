package com.decky.auth.services.impl;

import com.decky.auth.models.AppUser;
import com.decky.auth.repositories.AppUserRepository;
import com.decky.auth.dtos.AppUserDtos;
import com.decky.auth.services.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppUserServiceImpl implements AppUserService {

    private final PasswordEncoder passwordEncoder;
    private final AppUserRepository appUserRepository;

    public Optional<AppUserDtos.Response> getUserById(Long id) {
        return appUserRepository.findById(id)
                .map(AppUserDtos.Response::fromEntity);
    }

    public AppUserDtos.Response createUser(AppUserDtos.SignUpRequest request) {
        return AppUserDtos.Response.fromEntity(
                appUserRepository.save(AppUser.builder()
                        .username(request.username())
                        .password(passwordEncoder.encode(request.password()))
                        .build()));
    }
}
