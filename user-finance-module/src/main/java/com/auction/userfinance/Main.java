package com.auction.userfinance;

import com.auction.userfinance.entities.User;
import jakarta.enterprise.inject.se.SeContainer;
import jakarta.enterprise.inject.se.SeContainerInitializer;
import jakarta.persistence.EntityManager;

import java.util.logging.Level;
import java.util.logging.Logger;

public class Main {
    public static void main(String[] args) {
        Logger.getLogger("").setLevel(Level.SEVERE);
        try (SeContainer container = SeContainerInitializer.newInstance().initialize()){
            System.out.println("CDI container initialized successfully.");
            var em = container.select(EntityManager.class).get();
            System.out.println("Creating and persisting a new User...");
            User user = User.builder()
                    .name("John Doe")
                    .email("John")
                    .password("password123")
                    .reputationPoints(100)
                    .build();
            em.persist(user);

            System.out.println("User persisted with ID: " + user.getId());

        }catch (Exception e){
            System.err.println("Error initializing CDI container: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
