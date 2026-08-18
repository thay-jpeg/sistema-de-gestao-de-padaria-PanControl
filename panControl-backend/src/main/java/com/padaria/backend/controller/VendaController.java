package com.padaria.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.padaria.backend.dto.VendaRequestDTO;
import com.padaria.backend.model.Venda;
import com.padaria.backend.service.VendaService;

@RestController
@RequestMapping("/api/vendas")
@CrossOrigin(origins = "*")
public class VendaController {

    @Autowired
    private VendaService vendaService;

    @PostMapping
    public ResponseEntity<Venda> receberVenda(@RequestBody VendaRequestDTO request) {
        Venda vendaSalva = vendaService.registrarVenda(request);
        return ResponseEntity.ok(vendaSalva);
    }
}