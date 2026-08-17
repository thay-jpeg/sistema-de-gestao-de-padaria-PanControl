package com.padaria.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.ClienteAtacadista;

@Repository
public interface ClienteAtacadistaRepository extends JpaRepository<ClienteAtacadista, Integer> {
}