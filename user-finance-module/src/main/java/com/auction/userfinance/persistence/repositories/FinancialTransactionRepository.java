package com.auction.userfinance.persistence.repositories;

import com.auction.userfinance.persistence.entities.FinancialTransaction;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class FinancialTransactionRepository extends RepositoryBase<FinancialTransaction> {

    protected EntityManager em;

    @Inject
    public FinancialTransactionRepository(EntityManager em) {
        super(em, FinancialTransaction.class);
        this.em = em;
    }


}
