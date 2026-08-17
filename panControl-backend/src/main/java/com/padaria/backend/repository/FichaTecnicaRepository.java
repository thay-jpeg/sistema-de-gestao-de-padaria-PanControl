package com.padaria.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.FichaTecnica;

@Repository
public interface FichaTecnicaRepository extends JpaRepository<FichaTecnica, Integer> {
    
    // Método para buscar todos os ingredientes de um produto específico
    List<FichaTecnica> findByProdutoIdProduto(Integer idProduto);
}