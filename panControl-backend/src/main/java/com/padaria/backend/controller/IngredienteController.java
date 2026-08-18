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

import com.padaria.backend.dto.IngredienteRequestDTO;
import com.padaria.backend.dto.IngredienteResponseDTO;
import com.padaria.backend.service.IngredienteService;

@RestController
@RequestMapping("/api/ingredientes")
public class IngredienteController {

    @Autowired
    private IngredienteService ingredienteService;

    @PostMapping
    public ResponseEntity<IngredienteResponseDTO> criarIngrediente(@RequestBody IngredienteRequestDTO dto) {
        return new ResponseEntity<>(ingredienteService.criarIngrediente(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<IngredienteResponseDTO>> listarIngredientes() {
        return new ResponseEntity<>(ingredienteService.listarIngredientes(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IngredienteResponseDTO> buscarIngredientePorId(@PathVariable Integer id) {
        IngredienteResponseDTO ingrediente = ingredienteService.buscarIngredientePorId(id);
        if (ingrediente != null) {
            return new ResponseEntity<>(ingrediente, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IngredienteResponseDTO> atualizarIngrediente(@PathVariable Integer id, @RequestBody IngredienteRequestDTO dto) {
        IngredienteResponseDTO atualizado = ingredienteService.atualizarIngrediente(id, dto);
        if (atualizado != null) {
            return new ResponseEntity<>(atualizado, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarIngrediente(@PathVariable Integer id) {
        if (ingredienteService.deletarIngrediente(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}