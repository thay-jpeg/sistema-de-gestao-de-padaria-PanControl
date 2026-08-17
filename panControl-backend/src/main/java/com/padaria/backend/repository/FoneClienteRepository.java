package com.padaria.backend.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.FoneCliente;

@Repository
public interface FoneClienteRepository extends JpaRepository<FoneCliente, Integer> {
    List<FoneCliente> findByClienteIdClienteAtacadista(Integer idCliente);
}