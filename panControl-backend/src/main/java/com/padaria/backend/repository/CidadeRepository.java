package com.padaria.backend.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.Cidade;

@Repository
public interface CidadeRepository extends JpaRepository<Cidade, Integer> {
    Optional<Cidade> findByNomeCidade(String nomeCidade);
}