package com.padaria.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.padaria.backend.dto.ContatoRequestDTO;
import com.padaria.backend.model.EmailCliente;
import com.padaria.backend.model.FoneCliente;
import com.padaria.backend.repository.EmailClienteRepository;
import com.padaria.backend.repository.FoneClienteRepository;
import com.padaria.backend.service.ContatoService;

@RestController
@RequestMapping("/api/contatos")
public class ContatoController {

    @Autowired private ContatoService contatoService;
    @Autowired private EmailClienteRepository emailRepo;
    @Autowired private FoneClienteRepository foneRepo;

    @PostMapping("/email")
    public ResponseEntity<EmailCliente> salvarEmail(@RequestBody ContatoRequestDTO dto) {
        try {
            EmailCliente salvo = contatoService.processarEmail(dto);
            return new ResponseEntity<>(salvo, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/telefone")
    public ResponseEntity<FoneCliente> salvarTelefone(@RequestBody ContatoRequestDTO dto) {
        try {
            FoneCliente salvo = contatoService.processarTelefone(dto);
            return new ResponseEntity<>(salvo, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/email/{idCliente}")
    public ResponseEntity<String> buscarEmail(@PathVariable Integer idCliente) {
        List<EmailCliente> emails = emailRepo.findByClienteIdClienteAtacadista(idCliente);
        if (emails.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        String emailCompleto = emails.get(0).getCredencial() + "@" + emails.get(0).getDominio().getDominio();
        return new ResponseEntity<>(emailCompleto, HttpStatus.OK);
    }

    @GetMapping("/telefone/{idCliente}")
    public ResponseEntity<String> buscarTelefone(@PathVariable Integer idCliente) {
        List<FoneCliente> fones = foneRepo.findByClienteIdClienteAtacadista(idCliente);
        if (fones.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        String foneCompleto = fones.get(0).getDdd().getIdDdd() + fones.get(0).getNroTelefone();
        return new ResponseEntity<>(foneCompleto, HttpStatus.OK);
    }
}