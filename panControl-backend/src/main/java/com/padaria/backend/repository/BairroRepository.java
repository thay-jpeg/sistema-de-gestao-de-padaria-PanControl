package com.padaria.backend.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.Bairro;

@Repository
public interface BairroRepository extends JpaRepository<Bairro, Integer> {
    Optional<Bairro> findByNomeBairro(String nomeBairro);
}