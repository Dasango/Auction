package com.auction.userfinance.repositories;

import com.auction.userfinance.entities.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class UserRepository extends RepositoryBase<User> {

    @Inject
    public UserRepository(EntityManager em) {
        super(em, User.class);
    }


}