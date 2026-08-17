package com.padaria.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.padaria.backend.model.Produto;
import com.padaria.backend.repository.ProdutoRepository;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @PostMapping
    public ResponseEntity<Produto> criarProduto(@RequestBody Produto novoProduto) {
        if(novoProduto.getQuantidadeEstoque() == null) {
            novoProduto.setQuantidadeEstoque(0);
        }
        Produto produtoSalvo = produtoRepository.save(novoProduto);
        return new ResponseEntity<>(produtoSalvo, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listarProdutos() {
        return new ResponseEntity<>(produtoRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarProdutoPorId(@PathVariable Integer id) {
        Optional<Produto> produto = produtoRepository.findById(id);
        return produto.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                      .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Integer id, @RequestBody Produto produtoAtualizado) {
        Optional<Produto> produtoExistente = produtoRepository.findById(id);
        
        if (produtoExistente.isPresent()) {
            Produto produto = produtoExistente.get();
            
            produto.setNomeProduto(produtoAtualizado.getNomeProduto());
            produto.setCodigoBarras(produtoAtualizado.getCodigoBarras());
            produto.setDiasValidadePadrao(produtoAtualizado.getDiasValidadePadrao());
            produto.setPercentualICMS(produtoAtualizado.getPercentualICMS());
            produto.setPercentualLucroBalcao(produtoAtualizado.getPercentualLucroBalcao());
            produto.setPercentualLucroAtacado(produtoAtualizado.getPercentualLucroAtacado());
            produto.setPrecoBalcao(produtoAtualizado.getPrecoBalcao());
            produto.setPrecoAtacado(produtoAtualizado.getPrecoAtacado());
            
            if (produtoAtualizado.getQuantidadeEstoque() != null) {
                produto.setQuantidadeEstoque(produtoAtualizado.getQuantidadeEstoque());
            }
            
            Produto produtoSalvo = produtoRepository.save(produto);
            return new ResponseEntity<>(produtoSalvo, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Integer id) {
        Optional<Produto> produtoExistente = produtoRepository.findById(id);
        
        if (produtoExistente.isPresent()) {
            produtoRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}