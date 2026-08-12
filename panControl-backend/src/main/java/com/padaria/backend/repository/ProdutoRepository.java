package com.padaria.backend.repository;
//Isso vai permitir buscar os pães e produtos para mostrar na tela.
import com.padaria.backend.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}