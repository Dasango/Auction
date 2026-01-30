package com.auction.userfinance.persistence.repositories;

import com.auction.userfinance.persistence.dto.GhostUserDTO;
import com.auction.userfinance.persistence.dto.UserRiskDTO;
import com.auction.userfinance.persistence.dto.VIPUsersTransactionsAmountDTO;
import com.auction.userfinance.persistence.entities.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class UserRepository extends RepositoryBase<User> {

    protected EntityManager em;

    @Inject
    public UserRepository(EntityManager em) {
        super(em, User.class);
        this.em = em;
    }

    public List<VIPUsersTransactionsAmountDTO> getVIPUsersTransactionsAmount(){
        String jpql = "SELECT new com.auction.userfinance.persistence.dto.VIPUsersTransactionsAmountDTO(u.name, u.email, SUM(t.amount))" +
                " FROM User u" +
                " JOIN u.wallet w" +
                " JOIN w.transactions t" +
                " WHERE u.reputationPoints > 500" +
                " GROUP BY u" +
                " ORDER BY SUM(t.amount) DESC";
        return em.createQuery(jpql, VIPUsersTransactionsAmountDTO.class)
                .getResultList();
    }

    public List<UserRiskDTO> getUsersByRiskDTO(){

        String jpql = "SELECT new com.auction.userfinance.persistence.dto.UserRiskDTO(" +
                "   u.name, " +
                "   u.email, " +
                "   CASE " +
                "       WHEN w.blockedAmount > w.balance THEN 'HIGH RISK: How the... even happen' " +
                "       WHEN w.blockedAmount > (w.balance / 2) THEN 'MODERATE RISK' " +
                "       WHEN w.blockedAmount = 0 THEN 'NO RISK' " +
                "       ELSE 'NORMAL RISK' " +
                "   END" +
                ")" +
                " FROM User u" +
                " JOIN u.wallet w";

        return em.createQuery(jpql, UserRiskDTO.class)
                .getResultList();
    }

    public List<GhostUserDTO> getGhostUsers(Integer year) {

        LocalDateTime startOfYear = LocalDateTime.of(year, 1, 1, 0, 0, 0);

        String jpql = "SELECT new com.auction.userfinance.persistence.dto.GhostUserDTO(" +
                "   u.name," +
                "   w.balance," +
                "   MAX(t.timestamp)) " +
                " FROM User u" +
                " JOIN u.wallet w" +
                " JOIN w.transactions t" +
                " WHERE w.balance > 0" +
                " GROUP BY u.name, w.balance" +
                " HAVING MAX(t.timestamp) < :limitDate";

        return this.em.createQuery(jpql, GhostUserDTO.class)
                .setParameter("limitDate", startOfYear)
                .getResultList();
    }
}