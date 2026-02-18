package com.decky.today.persistence.repositories;


import com.decky.today.persistence.models.DailySession;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DailySessionRepository extends CrudRepository<DailySession, String> {

}