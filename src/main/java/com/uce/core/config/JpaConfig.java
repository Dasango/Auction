package com.uce.core.config;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.Initialized;
import jakarta.enterprise.context.RequestScoped;
import jakarta.enterprise.event.Observes;
import jakarta.enterprise.inject.Disposes;
import jakarta.enterprise.inject.Produces;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

@ApplicationScoped
public class JpaConfig {

    private EntityManagerFactory emf;

    public void init(@Observes @Initialized(ApplicationScoped.class) Object init) {
        this.emf = Persistence.createEntityManagerFactory("auctionPU");
    }

    @Produces
    @RequestScoped // Importante: Un EM por hilo/petición
    public EntityManager createEntityManager() {
        return emf.createEntityManager();
    }

    public void close(@Disposes EntityManager em) {
        if (em.isOpen()) {
            em.close();
        }
    }
}