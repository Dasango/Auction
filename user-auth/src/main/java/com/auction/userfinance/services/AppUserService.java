package com.auction.userfinance.services;

import com.auction.userfinance.persistence.repositories.AppUserRepository;
import com.auction.userfinance.services.dtos.AppUserDtos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class AppUserService {

    private final AppUserRepository appUserRepository;

    @Autowired
    public AppUserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public Optional<AppUserDtos.Response> getUserById(Long id){
        return appUserRepository.findById(id)
                .map(AppUserDtos.Response::fromEntity);
    }
}
