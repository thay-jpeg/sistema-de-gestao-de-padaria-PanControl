package com.padaria.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.ItemPedido;
import com.padaria.backend.model.PedidoVenda;

@Repository
public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {

    List<ItemPedido> findByPedidoVenda(PedidoVenda pedidoVenda);

}