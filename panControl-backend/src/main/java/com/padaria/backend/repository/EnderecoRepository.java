package com.padaria.backend.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.Endereco;

@Repository
public interface EnderecoRepository extends JpaRepository<Endereco, Integer> {

    List<Endereco> findByClienteIdClienteAtacadista(Integer idCliente);
}