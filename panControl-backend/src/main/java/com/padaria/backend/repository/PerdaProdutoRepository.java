package com.padaria.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.PerdaProduto;

@Repository
public interface PerdaProdutoRepository extends JpaRepository<PerdaProduto, Integer> {
    List<PerdaProduto> findByProdutoIdProduto(Integer idProduto);
}