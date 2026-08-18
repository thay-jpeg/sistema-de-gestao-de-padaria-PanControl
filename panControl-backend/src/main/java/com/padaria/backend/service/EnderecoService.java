package com.padaria.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.padaria.backend.dto.EnderecoRequestDTO;
import com.padaria.backend.dto.EnderecoResponseDTO;
import com.padaria.backend.model.Bairro;
import com.padaria.backend.model.Cidade;
import com.padaria.backend.model.ClienteAtacadista;
import com.padaria.backend.model.Endereco;
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

import jakarta.transaction.Transactional;

@Service
public class EnderecoService {

    @Autowired private EnderecoRepository enderecoRepo;
    @Autowired private UnidadeFederativaRepository ufRepo;
    @Autowired private CidadeRepository cidadeRepo;
    @Autowired private BairroRepository bairroRepo;
    @Autowired private TipoLogradouroRepository tipoLogRepo;
    @Autowired private LogradouroRepository logradouroRepo;
    @Autowired private ClienteAtacadistaRepository clienteRepo;

    @Transactional
    public EnderecoResponseDTO salvarEnderecoNormalizado(EnderecoRequestDTO dto) {
        ClienteAtacadista cliente = clienteRepo.findById(dto.idCliente).orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));

        UnidadeFederativa uf = ufRepo.findById(dto.siglaUF).orElseGet(() -> {
            UnidadeFederativa novaUf = new UnidadeFederativa();
            novaUf.setSiglaUF(dto.siglaUF);
            novaUf.setNomeUF(dto.siglaUF); 
            return ufRepo.save(novaUf);
        });

        Cidade cidade = cidadeRepo.findByNomeCidade(dto.nomeCidade).orElseGet(() -> {
            Cidade novaCidade = new Cidade();
            novaCidade.setNomeCidade(dto.nomeCidade);
            novaCidade.setUf(uf);
            return cidadeRepo.save(novaCidade);
        });

        Bairro bairro = bairroRepo.findByNomeBairro(dto.nomeBairro).orElseGet(() -> {
            Bairro novoBairro = new Bairro();
            novoBairro.setNomeBairro(dto.nomeBairro);
            return bairroRepo.save(novoBairro);
        });

        TipoLogradouro tipoLog = tipoLogRepo.findById(dto.siglaTipoLogradouro).orElseGet(() -> {
            TipoLogradouro novoTipo = new TipoLogradouro();
            novoTipo.setSiglaTipoLogradouro(dto.siglaTipoLogradouro);
            novoTipo.setNomeTipoLogradouro(dto.siglaTipoLogradouro);
            return tipoLogRepo.save(novoTipo);
        });

        Logradouro logradouro = logradouroRepo.findByNomeLogradouro(dto.nomeLogradouro).orElseGet(() -> {
            Logradouro novoLog = new Logradouro();
            novoLog.setNomeLogradouro(dto.nomeLogradouro);
            novoLog.setTipoLogradouro(tipoLog);
            return logradouroRepo.save(novoLog);
        });

        Endereco enderecoFinal = new Endereco();
        enderecoFinal.setCep(dto.cep);
        enderecoFinal.setNumeroEnd(dto.numeroEnd);
        enderecoFinal.setComplementoEnd(dto.complementoEnd);
        enderecoFinal.setCliente(cliente);
        enderecoFinal.setCidade(cidade);
        enderecoFinal.setBairro(bairro);
        enderecoFinal.setLogradouro(logradouro);

        return mapearEntidadeParaDto(enderecoRepo.save(enderecoFinal));
    }

    public EnderecoResponseDTO buscarEnderecoPorCliente(Integer idCliente) {
        List<Endereco> enderecos = enderecoRepo.findByClienteIdClienteAtacadista(idCliente);
        if (enderecos.isEmpty()) return null;
        return mapearEntidadeParaDto(enderecos.get(0));
    }

    private EnderecoResponseDTO mapearEntidadeParaDto(Endereco entidade) {
        EnderecoResponseDTO dto = new EnderecoResponseDTO();
        dto.idEndereco = entidade.getIdEndereco();
        dto.cep = entidade.getCep();
        dto.numero = entidade.getNumeroEnd();
        dto.complemento = entidade.getComplementoEnd();
        dto.uf = entidade.getCidade().getUf().getSiglaUF();
        dto.cidade = entidade.getCidade().getNomeCidade();
        dto.bairro = entidade.getBairro().getNomeBairro();
        dto.tipoLogradouro = entidade.getLogradouro().getTipoLogradouro().getNomeTipoLogradouro();
        dto.logradouro = entidade.getLogradouro().getNomeLogradouro();
        return dto;
    }
}