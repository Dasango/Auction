package com.auction.userfinance.persistence.repositories;

import com.auction.userfinance.persistence.models.FinancialTransaction;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FinancialTransactionRepository extends JpaRepository<FinancialTransaction, Long> {

}