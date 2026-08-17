package com.padaria.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.TipoLogradouro;

@Repository
public interface TipoLogradouroRepository extends JpaRepository<TipoLogradouro, String> {
}