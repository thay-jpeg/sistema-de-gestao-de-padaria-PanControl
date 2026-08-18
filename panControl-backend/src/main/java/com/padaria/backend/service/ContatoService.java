package com.padaria.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.padaria.backend.dto.ContatoRequestDTO;
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

@Service
public class ContatoService {

    @Autowired private EmailClienteRepository emailRepo;
    @Autowired private DominioEmailRepository dominioRepo;
    @Autowired private FoneClienteRepository foneRepo;
    @Autowired private DDDRepository dddRepo;
    @Autowired private DDIRepository ddiRepo;

    @Transactional
    public EmailCliente processarEmail(ContatoRequestDTO dto) {
        String[] partes = dto.getContatoCompleto().split("@");
        if (partes.length != 2) throw new IllegalArgumentException("E-mail inválido");

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
        cli.setIdClienteAtacadista(dto.getIdCliente());
        novoEmail.setCliente(cli);

        return emailRepo.save(novoEmail);
    }

    @Transactional
    public FoneCliente processarTelefone(ContatoRequestDTO dto) {
        String apenasNumeros = dto.getContatoCompleto().replaceAll("\\D", "");
        if (apenasNumeros.length() < 10) throw new IllegalArgumentException("Telefone inválido");

        Integer numeroDDD = Integer.parseInt(apenasNumeros.substring(0, 2));
        String nroTelefone = apenasNumeros.substring(2);

        DDI ddi = ddiRepo.findById(55).orElseGet(() -> { DDI n = new DDI(); n.setIdDdi(55); return ddiRepo.save(n); });
        DDD ddd = dddRepo.findById(numeroDDD).orElseGet(() -> { DDD n = new DDD(); n.setIdDdd(numeroDDD); return dddRepo.save(n); });

        FoneCliente fone = new FoneCliente();
        fone.setNroTelefone(nroTelefone);
        fone.setDdd(ddd);
        fone.setDdi(ddi);
        
        ClienteAtacadista cli = new ClienteAtacadista();
        cli.setIdClienteAtacadista(dto.getIdCliente());
        fone.setCliente(cli);

        return foneRepo.save(fone);
    }
}