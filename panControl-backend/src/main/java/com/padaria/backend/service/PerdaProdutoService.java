package com.padaria.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.padaria.backend.dto.PerdaProdutoRequestDTO;
import com.padaria.backend.dto.PerdaProdutoResponseDTO;
import com.padaria.backend.model.PerdaProduto;
import com.padaria.backend.model.Producao;
import com.padaria.backend.model.Produto;
import com.padaria.backend.model.Usuario;
import com.padaria.backend.repository.PerdaProdutoRepository;
import com.padaria.backend.repository.ProducaoRepository;
import com.padaria.backend.repository.ProdutoRepository;
import com.padaria.backend.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
public class PerdaProdutoService {

    @Autowired private PerdaProdutoRepository perdaRepo;
    @Autowired private ProducaoRepository producaoRepo;
    @Autowired private ProdutoRepository produtoRepo;
    @Autowired private UsuarioRepository usuarioRepo;

    @Transactional
    public PerdaProdutoResponseDTO registrarPerda(PerdaProdutoRequestDTO dto) {
        PerdaProduto perda = new PerdaProduto();
        
        perda.setQuantidadePerdida(dto.getQuantidadePerdida());
        perda.setMotivoPerda(dto.getMotivoPerda());
        perda.setDataPerda(dto.getDataPerda() != null ? dto.getDataPerda() : LocalDateTime.now());
        
        Producao producao = producaoRepo.findById(dto.getIdProducao()).orElseThrow(() -> new IllegalArgumentException("Produção não encontrada"));
        Produto produto = produtoRepo.findById(dto.getIdProduto()).orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));
        Usuario usuario = usuarioRepo.findById(dto.getIdUsuario()).orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        
        perda.setProducao(producao); 
        perda.setProduto(produto);
        perda.setUsuario(usuario);
        
        return mapearEntidadeParaDto(perdaRepo.save(perda));
    }

    public List<PerdaProdutoResponseDTO> listarPerdas() {
        return perdaRepo.findAll().stream().map(this::mapearEntidadeParaDto).collect(Collectors.toList());
    }

    public PerdaProdutoResponseDTO buscarPerdaPorId(Integer id) {
        return perdaRepo.findById(id).map(this::mapearEntidadeParaDto).orElse(null);
    }

    private PerdaProdutoResponseDTO mapearEntidadeParaDto(PerdaProduto entidade) {
        PerdaProdutoResponseDTO dto = new PerdaProdutoResponseDTO();
        dto.setIdPerdaProduto(entidade.getIdPerdaProduto());
        dto.setQuantidadePerdida(entidade.getQuantidadePerdida());
        dto.setMotivoPerda(entidade.getMotivoPerda());
        dto.setDataPerda(entidade.getDataPerda());
        dto.setIdProducao(entidade.getProducao().getIdProducao());
        dto.setIdProduto(entidade.getProduto().getIdProduto());
        dto.setIdUsuario(entidade.getUsuario().getIdUsuario());
        return dto;
    }
}