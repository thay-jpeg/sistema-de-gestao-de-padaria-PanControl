package com.padaria.backend.controller;

import com.padaria.backend.dto.PedidoRequestDTO;
import com.padaria.backend.model.PedidoVenda;
import com.padaria.backend.repository.PedidoVendaRepository;
import com.padaria.backend.service.VendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*") // Permite chamadas do front-end React
public class PedidoController {

    @Autowired
    private VendaService vendaService;

    // Faltava esta injeção aqui!
    @Autowired
    private PedidoVendaRepository pedidoVendaRepository;

    @GetMapping
    public ResponseEntity<List<PedidoVenda>> listarPedidos() {
        return ResponseEntity.ok(pedidoVendaRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<PedidoVenda> criarPedido(@RequestBody PedidoRequestDTO request) {
        PedidoVenda pedidoSalvo = vendaService.criarPedido(request);
        return new ResponseEntity<>(pedidoSalvo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<PedidoVenda> cancelarPedido(@PathVariable Long id) {
        PedidoVenda pedidoCancelado = vendaService.cancelarPedido(id);
        return new ResponseEntity<>(pedidoCancelado, HttpStatus.OK);
    }
}