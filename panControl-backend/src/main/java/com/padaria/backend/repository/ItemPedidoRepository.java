package com.padaria.backend.repository;

import com.padaria.backend.model.ItemPedido;
import com.padaria.backend.model.PedidoVenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {

    List<ItemPedido> findByPedidoVenda(PedidoVenda pedidoVenda);

}