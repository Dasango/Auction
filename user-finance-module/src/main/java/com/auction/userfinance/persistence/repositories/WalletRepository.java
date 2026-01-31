package com.auction.userfinance.persistence.repositories;

import com.auction.userfinance.persistence.models.Wallet;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletRepository extends JpaRepository<Wallet, Long> {

}
