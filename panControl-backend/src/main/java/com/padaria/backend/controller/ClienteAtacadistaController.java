package com.padaria.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.padaria.backend.dto.ClienteRequestDTO;
import com.padaria.backend.dto.ClienteResponseDTO;
import com.padaria.backend.service.ClienteService;

@RestController
@RequestMapping("/api/clientes")
public class ClienteAtacadistaController {

    @Autowired
    private ClienteService clienteService;

    @PostMapping
    public ResponseEntity<ClienteResponseDTO> criarCliente(@RequestBody ClienteRequestDTO dto) {
        return new ResponseEntity<>(clienteService.criarCliente(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ClienteResponseDTO>> listarClientes() {
        return new ResponseEntity<>(clienteService.listarClientes(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> buscarClientePorId(@PathVariable Integer id) {
        ClienteResponseDTO cliente = clienteService.buscarClientePorId(id);
        if (cliente != null) {
            return new ResponseEntity<>(cliente, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> atualizarCliente(@PathVariable Integer id, @RequestBody ClienteRequestDTO dto) {
        ClienteResponseDTO atualizado = clienteService.atualizarCliente(id, dto);
        if (atualizado != null) {
            return new ResponseEntity<>(atualizado, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCliente(@PathVariable Integer id) {
        if (clienteService.deletarCliente(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}