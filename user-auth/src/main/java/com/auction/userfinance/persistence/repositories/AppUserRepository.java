package com.auction.userfinance.persistence.repositories;


import com.auction.userfinance.persistence.models.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    public Optional<AppUser> findByName(String name);

}