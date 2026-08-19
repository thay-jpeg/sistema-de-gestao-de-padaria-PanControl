package com.padaria.backend.controller;

import com.padaria.backend.dto.IngredienteRelatorioDTO;
import com.padaria.backend.service.IngredienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/relatorios/ingredientes")
@CrossOrigin(origins = "*")
public class IngredienteRelatorioController {

    @Autowired
    private IngredienteService ingredienteService;

    @GetMapping
    public ResponseEntity<List<IngredienteRelatorioDTO>> obterRelatorio(
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim) {

        List<IngredienteRelatorioDTO> relatorio = ingredienteService.gerarRelatorio(dataInicio, dataFim);
        return ResponseEntity.ok(relatorio);
    }
}