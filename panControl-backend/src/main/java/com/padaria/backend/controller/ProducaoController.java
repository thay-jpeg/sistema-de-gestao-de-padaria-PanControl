package com.padaria.backend.controller;

import java.util.List;

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

import com.padaria.backend.dto.ProducaoRequestDTO;
import com.padaria.backend.dto.ProducaoResponseDTO;
import com.padaria.backend.service.ProducaoService;

@RestController
@RequestMapping("/api/producao")
public class ProducaoController {

    @Autowired
    private ProducaoService producaoService;

    @PostMapping
    public ResponseEntity<?> registrarProducao(@RequestBody ProducaoRequestDTO dto) {
        try {
            return new ResponseEntity<>(producaoService.registrarProducao(dto), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<ProducaoResponseDTO>> listarProducoes() {
        return new ResponseEntity<>(producaoService.listarProducoes(), HttpStatus.OK);
    }

    @GetMapping("/produto/{idProduto}")
    public ResponseEntity<List<ProducaoResponseDTO>> listarPorProduto(@PathVariable Integer idProduto) {
        List<ProducaoResponseDTO> producoes = producaoService.listarPorProduto(idProduto);
        return new ResponseEntity<>(producoes, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProducaoResponseDTO> buscarProducaoPorId(@PathVariable Integer id) {
        ProducaoResponseDTO producao = producaoService.buscarProducaoPorId(id);
        if (producao != null) return new ResponseEntity<>(producao, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProducao(@PathVariable Integer id) {
        if (producaoService.deletarProducao(id)) return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}