package com.padaria.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.CompraIngrediente;

@Repository
public interface CompraIngredienteRepository extends JpaRepository<CompraIngrediente, Integer> {
    
    @Query("SELECT c FROM CompraIngrediente c WHERE c.ingrediente.idIngrediente = :id")
    List<CompraIngrediente> buscarPorIdIngrediente(@Param("id") Integer idIngrediente);
}