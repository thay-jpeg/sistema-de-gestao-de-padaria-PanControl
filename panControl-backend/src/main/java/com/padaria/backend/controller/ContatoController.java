package com.padaria.backend.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.padaria.backend.model.ClienteAtacadista;
import com.padaria.backend.model.DDD;
import com.padaria.backend.model.DDI;
import com.padaria.backend.model.DominioEmail;
import com.padaria.backend.model.EmailCliente;
import com.padaria.backend.model.FoneCliente;
import com.padaria.backend.repository.DDDRepository;
import com.padaria.backend.repository.DDIRepository;
import com.padaria.backend.repository.DominioEmailRepository;
import com.padaria.backend.repository.EmailClienteRepository;
import com.padaria.backend.repository.FoneClienteRepository;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/contatos")
public class ContatoController {

    @Autowired private EmailClienteRepository emailRepo;
    @Autowired private DominioEmailRepository dominioRepo;
    @Autowired private FoneClienteRepository foneRepo;
    @Autowired private DDDRepository dddRepo;
    @Autowired private DDIRepository ddiRepo;

    @PostMapping("/email")
    @Transactional
    public ResponseEntity<?> salvarEmail(@RequestParam Integer idCliente, @RequestParam String emailCompleto) {
        String[] partes = emailCompleto.split("@");
        if (partes.length != 2) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        
        DominioEmail dominio = dominioRepo.findByDominio(partes[1]);
        if (dominio == null) {
            dominio = new DominioEmail();
            dominio.setDominio(partes[1]);
            dominio = dominioRepo.save(dominio);
        }

        EmailCliente novoEmail = new EmailCliente();
        novoEmail.setCredencial(partes[0]);
        novoEmail.setDominio(dominio);
        ClienteAtacadista cli = new ClienteAtacadista();
        cli.setIdClienteAtacadista(idCliente);
        novoEmail.setCliente(cli);
        
        return new ResponseEntity<>(emailRepo.save(novoEmail), HttpStatus.CREATED);
    }

    @GetMapping("/email/{idCliente}")
    public ResponseEntity<String> buscarEmail(@PathVariable Integer idCliente) {
        List<EmailCliente> emails = emailRepo.findByClienteIdClienteAtacadista(idCliente);
        if (emails.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
 
        String emailCompleto = emails.get(0).getCredencial() + "@" + emails.get(0).getDominio().getDominio();
        return new ResponseEntity<>(emailCompleto, HttpStatus.OK);
    }

    @PostMapping("/telefone")
    @Transactional
    public ResponseEntity<?> salvarTelefone(@RequestParam Integer idCliente, @RequestParam String telefoneCompleto) {
        String apenasNumeros = telefoneCompleto.replaceAll("\\D", "");
        if (apenasNumeros.length() < 10) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        Integer numeroDDD = Integer.parseInt(apenasNumeros.substring(0, 2));
        String nroTelefone = apenasNumeros.substring(2);

        DDI ddi = ddiRepo.findById(55).orElseGet(() -> { DDI n = new DDI(); n.setIdDdi(55); return ddiRepo.save(n); });
        DDD ddd = dddRepo.findById(numeroDDD).orElseGet(() -> { DDD n = new DDD(); n.setIdDdd(numeroDDD); return dddRepo.save(n); });

        FoneCliente fone = new FoneCliente();
        fone.setNroTelefone(nroTelefone);
        fone.setDdd(ddd);
        fone.setDdi(ddi);
        ClienteAtacadista cli = new ClienteAtacadista();
        cli.setIdClienteAtacadista(idCliente);
        fone.setCliente(cli);

        return new ResponseEntity<>(foneRepo.save(fone), HttpStatus.CREATED);
    }

    @GetMapping("/telefone/{idCliente}")
    public ResponseEntity<String> buscarTelefone(@PathVariable Integer idCliente) {
        List<FoneCliente> fones = foneRepo.findByClienteIdClienteAtacadista(idCliente);
        if (fones.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        String foneCompleto = fones.get(0).getDdd().getIdDdd() + fones.get(0).getNroTelefone();
        return new ResponseEntity<>(foneCompleto, HttpStatus.OK);
    }
}