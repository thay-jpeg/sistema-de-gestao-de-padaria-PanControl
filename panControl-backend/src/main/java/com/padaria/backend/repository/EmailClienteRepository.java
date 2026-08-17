package com.padaria.backend.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.EmailCliente;

@Repository
public interface EmailClienteRepository extends JpaRepository<EmailCliente, Integer> {
    List<EmailCliente> findByClienteIdClienteAtacadista(Integer idCliente);
}