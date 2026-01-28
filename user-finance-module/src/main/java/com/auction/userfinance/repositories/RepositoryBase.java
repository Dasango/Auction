package com.auction.userfinance.repositories;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;

public abstract class RepositoryBase<T> {

    protected final EntityManager em;
    private final Class<T> entityClass;

    void runInTransaction(Consumer<EntityManager> action){
        var txt = em.getTransaction();
        try{
            txt.begin();
            action.accept(em);
            txt.commit();
        } catch (RuntimeException e) {
            if (txt.isActive())
                txt.rollback();
            throw e;
        }
    }

    @Inject
    public RepositoryBase(EntityManager em, Class<T> entityClass) {
        this.em = em;
        this.entityClass = entityClass;
    }

    public void create(T obj) {
        Consumer<EntityManager> action = x -> x.persist(obj);
        runInTransaction(action);
    }

    public void update(T obj) {
        Consumer<EntityManager> action = x -> x.merge(obj);
        runInTransaction(action);
    }

    public void delete(Object obj) {
        Consumer<EntityManager> action = x -> x.remove(obj);
        runInTransaction(action);
    }

    public Optional<T> findById(Long id) {
        return Optional.ofNullable(em.find(entityClass, id));
    }

//    public List<T> findAll() {
//        String jpql = "SELECT e FROM " + entityClass.getSimpleName() + " e";
//        return em.createQuery(jpql, entityClass)
//                .getResultList();
//    }
    public List<T> findAll() {

        var cb = em.getCriteriaBuilder();
        var cq = cb.createQuery(entityClass);
        var rootEntry = cq.from(entityClass);
        var all = cq.select(rootEntry);

        return em.createQuery(all).getResultList();
    }
}