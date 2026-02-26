package com.decky.auth.web.security;

import com.decky.auth.models.AppUser;
import com.decky.auth.repositories.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AppUserRepository appUserRepository;

    @Autowired
    public UserDetailsServiceImpl(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {

        AppUser appUser = appUserRepository.findByUsername(name)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + name));

        return User.builder()
                .username(appUser.getUsername())
                .password(appUser.getPassword())
                .authorities(new ArrayList<>())
                .build();
    }
}
