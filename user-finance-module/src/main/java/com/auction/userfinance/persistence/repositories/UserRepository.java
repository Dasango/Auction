package com.auction.userfinance.persistence.repositories;


import com.auction.userfinance.persistence.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

}