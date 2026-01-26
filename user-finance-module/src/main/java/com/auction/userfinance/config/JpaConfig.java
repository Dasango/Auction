package com.auction.userfinance.config;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Disposes;
import jakarta.enterprise.inject.Produces;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

@ApplicationScoped
public class JpaConfig {


    @Produces
    @ApplicationScoped
    public EntityManagerFactory entityManagerFactory() {
        return Persistence.createEntityManagerFactory("auction_db");
    }
    @Produces
    public EntityManager entityManager(EntityManagerFactory emf) {
        return emf.createEntityManager();
    }
    public void closeEntityManager(@Disposes EntityManager em) {
        if (em.isOpen()) {
            em.close();
        }
    }
    public void closeEntityManagerFactory(@Disposes EntityManagerFactory emf) {
        if (emf.isOpen()) {
            emf.close();
        }
    }

}
