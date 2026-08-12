package com.padaria.backend.controller;

import com.padaria.backend.model.Produto;
import com.padaria.backend.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @PostMapping
    public ResponseEntity<Produto> cadastrarProduto(@RequestBody Produto produto) {
        Produto produtoSalvo = produtoRepository.save(produto);
        return ResponseEntity.ok(produtoSalvo);
    }
}