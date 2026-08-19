package com.padaria.backend.controller;

import com.padaria.backend.dto.VendaRequisitadaDTO;
import com.padaria.backend.model.Venda;
import com.padaria.backend.service.VendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendas")
@CrossOrigin(origins = "*")
public class VendaController {

    @Autowired
    private VendaService vendaService;

    @PostMapping
    public ResponseEntity<Venda> receberVenda(@RequestBody VendaRequisitadaDTO request) {
        Venda vendaSalva = vendaService.registrarVenda(request);
        return ResponseEntity.ok(vendaSalva);
    }
}