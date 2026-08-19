package com.padaria.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

import com.padaria.backend.model.PedidoVenda;

@Repository
public interface PedidoVendaRepository extends JpaRepository<PedidoVenda, Long> {
    List<PedidoVenda> findByDataPedidoBetween(LocalDateTime dataInicio, LocalDateTime dataFim);
}