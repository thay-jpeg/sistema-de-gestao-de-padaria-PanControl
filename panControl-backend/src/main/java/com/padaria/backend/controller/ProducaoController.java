package com.padaria.backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.padaria.backend.model.Producao;
import com.padaria.backend.repository.ProducaoRepository;

@RestController
@RequestMapping("/api/producao")
public class ProducaoController {

    @Autowired
    private ProducaoRepository producaoRepository;

    @PostMapping
    public ResponseEntity<Producao> registrarProducao(@RequestBody Producao novaProducao) {
        // Se a data de produção não for enviada, assume o momento atual
        if (novaProducao.getDataProducao() == null) {
            novaProducao.setDataProducao(LocalDateTime.now());
        }
        
        Producao producaoSalva = producaoRepository.save(novaProducao);
        
        return new ResponseEntity<>(producaoSalva, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Producao>> listarProducoes() {
        return new ResponseEntity<>(producaoRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/produto/{idProduto}")
    public ResponseEntity<List<Producao>> listarPorProduto(@PathVariable Integer idProduto) {
        return new ResponseEntity<>(producaoRepository.findByProdutoIdProduto(idProduto), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producao> buscarProducaoPorId(@PathVariable Integer id) {
        Optional<Producao> producao = producaoRepository.findById(id);
        return producao.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                       .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProducao(@PathVariable Integer id) {
       
        if (producaoRepository.existsById(id)) {
            producaoRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}