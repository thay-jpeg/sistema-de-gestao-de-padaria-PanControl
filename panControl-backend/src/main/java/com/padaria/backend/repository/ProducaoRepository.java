package com.padaria.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.Producao;

@Repository
public interface ProducaoRepository extends JpaRepository<Producao, Integer> {
    
    List<Producao> findByProdutoIdProduto(Integer idProduto);
}