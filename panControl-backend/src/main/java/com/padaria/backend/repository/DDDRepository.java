package com.padaria.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.DDD;

@Repository
public interface DDDRepository extends JpaRepository<DDD, Integer> {}