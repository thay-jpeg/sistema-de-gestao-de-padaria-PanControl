package com.padaria.backend.controller;

import com.padaria.backend.model.ClienteAtacadista;
import com.padaria.backend.repository.ClienteAtacadistaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
public class ClienteAtacadistaController {

    @Autowired
    private ClienteAtacadistaRepository clienteRepository;

    @PostMapping
    public ResponseEntity<ClienteAtacadista> criarCliente(@RequestBody ClienteAtacadista novoCliente) {
        if(novoCliente.getAtivo() == null) {
            novoCliente.setAtivo(true);
        }
        ClienteAtacadista clienteSalvo = clienteRepository.save(novoCliente);
        return new ResponseEntity<>(clienteSalvo, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ClienteAtacadista>> listarClientes() {
        return new ResponseEntity<>(clienteRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteAtacadista> buscarClientePorId(@PathVariable Integer id) {
        Optional<ClienteAtacadista> cliente = clienteRepository.findById(id);
        return cliente.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteAtacadista> atualizarCliente(@PathVariable Integer id, @RequestBody ClienteAtacadista clienteAtualizado) {
        Optional<ClienteAtacadista> clienteExistente = clienteRepository.findById(id);

        if (clienteExistente.isPresent()) {
            ClienteAtacadista cliente = clienteExistente.get();

            cliente.setNomeRazaoSocial(clienteAtualizado.getNomeRazaoSocial());
            cliente.setTipoPessoa(clienteAtualizado.getTipoPessoa());
            cliente.setDocumentoCliente(clienteAtualizado.getDocumentoCliente());
            cliente.setDataNascimento(clienteAtualizado.getDataNascimento());

            if (clienteAtualizado.getAtivo() != null) {
                cliente.setAtivo(clienteAtualizado.getAtivo());
            }

            ClienteAtacadista clienteSalvo = clienteRepository.save(cliente);
            return new ResponseEntity<>(clienteSalvo, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCliente(@PathVariable Integer id) {
        Optional<ClienteAtacadista> clienteExistente = clienteRepository.findById(id);

        if (clienteExistente.isPresent()) {
            clienteRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}