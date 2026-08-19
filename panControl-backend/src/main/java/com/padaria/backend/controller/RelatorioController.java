package com.padaria.backend.controller;

import com.padaria.backend.model.PedidoVenda;
import com.padaria.backend.model.Venda;
import com.padaria.backend.repository.PedidoVendaRepository;
import com.padaria.backend.repository.RelatorioIngredienteProjection;
import com.padaria.backend.repository.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/relatorios")
@CrossOrigin(origins = "*")
public class RelatorioController {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private PedidoVendaRepository pedidoVendaRepository;

    @GetMapping("/vendas")
    public ResponseEntity<List<Venda>> relatorioVendas(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {

        if (dataInicio != null && dataFim != null) {
            LocalDateTime inicio = dataInicio.atStartOfDay();
            LocalDateTime fim = dataFim.atTime(23, 59, 59);
            return ResponseEntity.ok(vendaRepository.findByDataVendaBetween(inicio, fim));
        }
        return ResponseEntity.ok(vendaRepository.findAll());
    }

    @GetMapping("/pedidos")
    public ResponseEntity<List<PedidoVenda>> relatorioPedidos(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {

        if (dataInicio != null && dataFim != null) {
            LocalDateTime inicio = dataInicio.atStartOfDay();
            LocalDateTime fim = dataFim.atTime(23, 59, 59);
            return ResponseEntity.ok(pedidoVendaRepository.findByDataPedidoBetween(inicio, fim));
        }
        return ResponseEntity.ok(pedidoVendaRepository.findAll());
    }
}