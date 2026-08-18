package com.padaria.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.PedidoVenda;

@Repository
public interface PedidoVendaRepository extends JpaRepository<PedidoVenda, Long> {
}