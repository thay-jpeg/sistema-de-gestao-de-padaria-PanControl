package com.padaria.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.Venda;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {
     List<Venda> findByDataVendaBetween(LocalDateTime dataInicio, LocalDateTime dataFim);
}