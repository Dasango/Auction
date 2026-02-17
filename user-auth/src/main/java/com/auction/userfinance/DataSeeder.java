package com.auction.userfinance; // Ajusta a tu paquete

import com.auction.userfinance.persistence.models.AppUser;
import com.auction.userfinance.persistence.repositories.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class DataSeeder implements CommandLineRunner {

    private final AppUserRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataSeeder(AppUserRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        usuarioRepository.findByName("admin").ifPresentOrElse(
                user -> System.out.println("Admin already exists in the database"),
                () -> {
                    usuarioRepository.save(
                            AppUser.builder()
                                    .name("admin")
                                    .email("admin@test.com")
                                    .password(passwordEncoder.encode("1234"))
                                    .reputationPoints(0)
                                    .build()
                    );
                    System.out.println("Admin user created successfully");
                }
        );
    }
}