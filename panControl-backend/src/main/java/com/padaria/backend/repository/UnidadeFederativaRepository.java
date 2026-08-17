package com.padaria.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.UnidadeFederativa;

@Repository
public interface UnidadeFederativaRepository extends JpaRepository<UnidadeFederativa, String> {
    // UF é a própria chave primária
}