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

    // Chama o Service que acabamos de criar
    @Autowired
    private VendaService vendaService;

    @PostMapping
    public ResponseEntity<Venda> receberVenda(@RequestBody VendaRequisitadaDTO request) {

        // Manda o DTO para o Service calcular e salvar
        Venda vendaSalva = vendaService.registrarVenda(request);

        // Devolve o "Recibo" (A venda salva com o ID gerado pelo banco) e o status 200 OK
        return ResponseEntity.ok(vendaSalva);
    }
}