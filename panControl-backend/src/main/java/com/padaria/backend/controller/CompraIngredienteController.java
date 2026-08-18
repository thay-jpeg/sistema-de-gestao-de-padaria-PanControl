package com.padaria.backend.controller;

import com.padaria.backend.dto.CompraIngredienteRequestDTO;
import com.padaria.backend.dto.CompraIngredienteResponseDTO;
import com.padaria.backend.service.CompraIngredienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compras")
public class CompraIngredienteController {

    @Autowired private CompraIngredienteService compraService;

    @PostMapping
    public ResponseEntity<?> registrarCompra(@RequestBody CompraIngredienteRequestDTO dto) {
        try {
            return new ResponseEntity<>(compraService.registrarCompra(dto), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<CompraIngredienteResponseDTO>> listarCompras() {
        return new ResponseEntity<>(compraService.listarCompras(), HttpStatus.OK);
    }
}