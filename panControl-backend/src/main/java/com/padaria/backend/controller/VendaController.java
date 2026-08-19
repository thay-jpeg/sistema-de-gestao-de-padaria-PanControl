package com.padaria.backend.controller;

import com.padaria.backend.dto.VendaRequestDTO;
import com.padaria.backend.model.Venda;
import com.padaria.backend.service.VendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // NOVO: Rota para o Relatório de Vendas
    @GetMapping
    public ResponseEntity<List<Venda>> listarVendas() {
        return ResponseEntity.ok(vendaService.listarTodasAsVendas());
    }
}