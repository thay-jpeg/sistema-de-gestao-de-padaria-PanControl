package com.padaria.backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.padaria.backend.model.PerdaProduto;
import com.padaria.backend.repository.PerdaProdutoRepository;

@RestController
@RequestMapping("/api/perdas")
public class PerdaProdutoController {

    @Autowired
    private PerdaProdutoRepository perdaRepository;

    @PostMapping
    public ResponseEntity<PerdaProduto> registrarPerda(@RequestBody PerdaProduto novaPerda) {
        if (novaPerda.getDataPerda() == null) {
            novaPerda.setDataPerda(LocalDateTime.now());
        }
        PerdaProduto perdaSalva = perdaRepository.save(novaPerda);
        return new ResponseEntity<>(perdaSalva, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PerdaProduto>> listarPerdas() {
        return new ResponseEntity<>(perdaRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PerdaProduto> buscarPerdaPorId(@PathVariable Integer id) {
        Optional<PerdaProduto> perda = perdaRepository.findById(id);
        return perda.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}