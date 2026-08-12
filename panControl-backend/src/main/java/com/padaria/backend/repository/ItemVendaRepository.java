package com.padaria.backend.repository;
//Salva cada pão ou item individual que estava no carrinho
import com.padaria.backend.model.ItemVenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemVendaRepository extends JpaRepository<ItemVenda, Long> {
}