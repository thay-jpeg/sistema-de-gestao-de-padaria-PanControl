package com.padaria.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.padaria.backend.dto.PedidoRequestDTO;
import com.padaria.backend.model.PedidoVenda;
import com.padaria.backend.service.VendaService;

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

    // Rota para ENTREGAR um pedido
    @PutMapping("/{id}/entregar")
    public ResponseEntity<PedidoVenda> entregarPedido(@PathVariable Long id) {
        PedidoVenda pedidoEntregue = vendaService.entregarPedido(id);
        return ResponseEntity.ok(pedidoEntregue);
    }
}
