package com.padaria.backend.controller;

import com.padaria.backend.dto.PedidoRequestDTO;
import com.padaria.backend.model.PedidoVenda;
import com.padaria.backend.service.VendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private VendaService vendaService;

    // Rota para CRIAR um novo pedido
    @PostMapping
    public ResponseEntity<PedidoVenda> criarPedido(@RequestBody PedidoRequestDTO request) {
        PedidoVenda pedidoSalvo = vendaService.criarPedido(request);
        return ResponseEntity.ok(pedidoSalvo);
    }

    // Rota para o RELATÓRIO: lista todos os pedidos
    @GetMapping
    public ResponseEntity<List<PedidoVenda>> listarPedidos() {
        return ResponseEntity.ok(vendaService.listarTodosOsPedidos());
    }

    // Rota para CANCELAR um pedido
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<PedidoVenda> cancelarPedido(@PathVariable Long id) {
        PedidoVenda pedidoCancelado = vendaService.cancelarPedido(id);
        return ResponseEntity.ok(pedidoCancelado);
    }
}