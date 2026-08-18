package com.padaria.backend.controller;

import java.util.List;

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

import com.padaria.backend.dto.FichaTecnicaRequestDTO;
import com.padaria.backend.dto.FichaTecnicaResponseDTO;
import com.padaria.backend.service.FichaTecnicaService;

@RestController
@RequestMapping("/api/fichastecnicas")
public class FichaTecnicaController {

    @Autowired
    private FichaTecnicaService fichaService;

    @PostMapping
    public ResponseEntity<?> criarFichaTecnica(@RequestBody FichaTecnicaRequestDTO dto) {
        try {
            return new ResponseEntity<>(fichaService.criarFichaTecnica(dto), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<FichaTecnicaResponseDTO>> listarFichas() {
        return new ResponseEntity<>(fichaService.listarFichas(), HttpStatus.OK);
    }

    @GetMapping("/produto/{idProduto}")
    public ResponseEntity<List<FichaTecnicaResponseDTO>> listarFichasPorProduto(@PathVariable Integer idProduto) {
        List<FichaTecnicaResponseDTO> fichas = fichaService.listarFichasPorProduto(idProduto);
        if(fichas.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(fichas, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FichaTecnicaResponseDTO> buscarFichaPorId(@PathVariable Integer id) {
        FichaTecnicaResponseDTO ficha = fichaService.buscarFichaPorId(id);
        if (ficha != null) return new ResponseEntity<>(ficha, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FichaTecnicaResponseDTO> atualizarFicha(@PathVariable Integer id, @RequestBody FichaTecnicaRequestDTO dto) {
        FichaTecnicaResponseDTO atualizada = fichaService.atualizarFicha(id, dto);
        if (atualizada != null) return new ResponseEntity<>(atualizada, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarFicha(@PathVariable Integer id) {
        if (fichaService.deletarFicha(id)) return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}