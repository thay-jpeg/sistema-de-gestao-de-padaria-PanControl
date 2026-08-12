package com.padaria.backend.repository;
//Isso vai permitir vincular a venda àquele cliente atacadista que foi selecionado.
import com.padaria.backend.model.ClienteAtacadista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//Spring Boot lê isso e  entrega os métodos .save(), .findAll() e .deleteById().
@Repository
public interface ClienteAtacadistaRepository extends JpaRepository<ClienteAtacadista, Long> {
}