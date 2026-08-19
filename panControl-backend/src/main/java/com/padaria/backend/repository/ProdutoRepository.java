package com.padaria.backend.repository;

import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.padaria.backend.model.Produto;

public interface ProdutoRepository extends JpaRepository<Produto, Integer> {

    // Adicione esta linha para consertar o erro vermelho da imagem
    List<Produto> findByNomeProdutoContainingIgnoreCaseOrCodigoBarrasContainingIgnoreCase(String nomeProduto, String codigoBarras);

    // Aproveite e adicione esta também, pois o colega usou no método "buscarPorNome" logo abaixo
    Optional<Produto> findByNomeProdutoContainingIgnoreCase(String nomeProduto);
}