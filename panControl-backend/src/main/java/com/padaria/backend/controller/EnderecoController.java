package com.padaria.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.padaria.backend.dto.EnderecoRequestDTO;
import com.padaria.backend.dto.EnderecoResponseDTO;
import com.padaria.backend.service.EnderecoService;

@RestController
@RequestMapping("/api/enderecos")
public class EnderecoController {

    @Autowired private EnderecoService enderecoService;

    @PostMapping
    public ResponseEntity<?> salvarEnderecoNormalizado(@RequestBody EnderecoRequestDTO dto) {
        try {
            return new ResponseEntity<>(enderecoService.salvarEnderecoNormalizado(dto), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<EnderecoResponseDTO> buscarEnderecoPorCliente(@PathVariable Integer idCliente) {
        EnderecoResponseDTO endereco = enderecoService.buscarEnderecoPorCliente(idCliente);
        if (endereco == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(endereco, HttpStatus.OK);
    }
}