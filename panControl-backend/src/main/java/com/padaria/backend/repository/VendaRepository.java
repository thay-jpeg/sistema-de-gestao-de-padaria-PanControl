package com.padaria.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.Venda;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {
}