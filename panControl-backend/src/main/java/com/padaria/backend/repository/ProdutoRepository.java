package com.padaria.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
}