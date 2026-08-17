package com.padaria.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.DDI;

@Repository
public interface DDIRepository extends JpaRepository<DDI, Integer> {}