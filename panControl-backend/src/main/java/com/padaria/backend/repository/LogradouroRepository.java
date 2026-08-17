package com.padaria.backend.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.Logradouro;

@Repository
public interface LogradouroRepository extends JpaRepository<Logradouro, Integer> {
    Optional<Logradouro> findByNomeLogradouro(String nomeLogradouro);
}