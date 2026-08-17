package com.padaria.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.padaria.backend.model.Bairro;
import com.padaria.backend.model.Cidade;
import com.padaria.backend.model.ClienteAtacadista;
import com.padaria.backend.model.Endereco;
import com.padaria.backend.model.EnderecoDTO;
import com.padaria.backend.model.Logradouro;
import com.padaria.backend.model.TipoLogradouro;
import com.padaria.backend.model.UnidadeFederativa;
import com.padaria.backend.repository.BairroRepository;
import com.padaria.backend.repository.CidadeRepository;
import com.padaria.backend.repository.ClienteAtacadistaRepository;
import com.padaria.backend.repository.EnderecoRepository;
import com.padaria.backend.repository.LogradouroRepository;
import com.padaria.backend.repository.TipoLogradouroRepository;
import com.padaria.backend.repository.UnidadeFederativaRepository;

@RestController
@RequestMapping("/api/enderecos")
public class EnderecoController {

    @Autowired private EnderecoRepository enderecoRepo;
    @Autowired private UnidadeFederativaRepository ufRepo;
    @Autowired private CidadeRepository cidadeRepo;
    @Autowired private BairroRepository bairroRepo;
    @Autowired private TipoLogradouroRepository tipoLogRepo;
    @Autowired private LogradouroRepository logradouroRepo;
    @Autowired private ClienteAtacadistaRepository clienteRepo;

    @PostMapping
    public ResponseEntity<Endereco> salvarEnderecoNormalizado(@RequestBody EnderecoDTO dto) {
        
        // Verifica se o cliente existe
        Optional<ClienteAtacadista> clienteOpt = clienteRepo.findById(dto.idCliente);
        if (clienteOpt.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        // Busca ou cria a UF
        UnidadeFederativa uf = ufRepo.findById(dto.siglaUF).orElseGet(() -> {
            UnidadeFederativa novaUf = new UnidadeFederativa();
            novaUf.setSiglaUF(dto.siglaUF);
            novaUf.setNomeUF(dto.siglaUF); 
            return ufRepo.save(novaUf);
        });

        // Busca ou cria a Cidade
        Cidade cidade = cidadeRepo.findByNomeCidade(dto.nomeCidade).orElseGet(() -> {
            Cidade novaCidade = new Cidade();
            novaCidade.setNomeCidade(dto.nomeCidade);
            novaCidade.setUf(uf);
            return cidadeRepo.save(novaCidade);
        });

        // Busca ou cria o Bairro
        Bairro bairro = bairroRepo.findByNomeBairro(dto.nomeBairro).orElseGet(() -> {
            Bairro novoBairro = new Bairro();
            novoBairro.setNomeBairro(dto.nomeBairro);
            return bairroRepo.save(novoBairro);
        });

        // Busca ou cria o Tipo de Logradouro
        TipoLogradouro tipoLog = tipoLogRepo.findById(dto.siglaTipoLogradouro).orElseGet(() -> {
            TipoLogradouro novoTipo = new TipoLogradouro();
            novoTipo.setSiglaTipoLogradouro(dto.siglaTipoLogradouro);
            novoTipo.setNomeTipoLogradouro(dto.siglaTipoLogradouro);
            return tipoLogRepo.save(novoTipo);
        });

        // Busca ou cria o Logradouro
        Logradouro logradouro = logradouroRepo.findByNomeLogradouro(dto.nomeLogradouro).orElseGet(() -> {
            Logradouro novoLog = new Logradouro();
            novoLog.setNomeLogradouro(dto.nomeLogradouro);
            novoLog.setTipoLogradouro(tipoLog);
            return logradouroRepo.save(novoLog);
        });

        // monta o Endereço 
        Endereco enderecoFinal = new Endereco();
        enderecoFinal.setCep(dto.cep);
        enderecoFinal.setNumeroEnd(dto.numeroEnd);
        enderecoFinal.setComplementoEnd(dto.complementoEnd);
        enderecoFinal.setCliente(clienteOpt.get());
        enderecoFinal.setCidade(cidade);
        enderecoFinal.setBairro(bairro);
        enderecoFinal.setLogradouro(logradouro);

        return new ResponseEntity<>(enderecoRepo.save(enderecoFinal), HttpStatus.CREATED);
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<Endereco> buscarEnderecoPorCliente(@PathVariable Integer idCliente) {
        List<Endereco> enderecos = enderecoRepo.findByClienteIdClienteAtacadista(idCliente);
        
        if (enderecos.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
 
        return new ResponseEntity<>(enderecos.get(0), HttpStatus.OK);
    }
}