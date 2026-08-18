package com.padaria.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.padaria.backend.dto.PerdaProdutoRequestDTO;
import com.padaria.backend.dto.PerdaProdutoResponseDTO;
import com.padaria.backend.service.PerdaProdutoService;

@RestController
@RequestMapping("/api/perdas")
public class PerdaProdutoController {

    @Autowired private PerdaProdutoService perdaService;

    @PostMapping
    public ResponseEntity<?> registrarPerda(@RequestBody PerdaProdutoRequestDTO dto) {
        try {
            return new ResponseEntity<>(perdaService.registrarPerda(dto), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<PerdaProdutoResponseDTO>> listarPerdas() {
        return new ResponseEntity<>(perdaService.listarPerdas(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PerdaProdutoResponseDTO> buscarPerdaPorId(@PathVariable Integer id) {
        PerdaProdutoResponseDTO perda = perdaService.buscarPerdaPorId(id);
        if (perda != null) return new ResponseEntity<>(perda, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}