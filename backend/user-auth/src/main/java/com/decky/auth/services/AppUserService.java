package com.decky.auth.services;

import com.decky.auth.dtos.AppUserDtos;

import java.util.Optional;

public interface AppUserService {
    Optional<AppUserDtos.Response> getUserById(Long id);

    AppUserDtos.Response createUser(AppUserDtos.SignUpRequest request);
}
