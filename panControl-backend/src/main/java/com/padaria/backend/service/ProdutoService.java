package com.padaria.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.padaria.backend.dto.ProdutoRequestDTO;
import com.padaria.backend.dto.ProdutoResponseDTO;
import com.padaria.backend.model.Produto;
import com.padaria.backend.repository.ProdutoRepository;

import jakarta.transaction.Transactional;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Transactional
    public ProdutoResponseDTO criarProduto(ProdutoRequestDTO dto) {
        Produto produto = new Produto();
        mapearDtoParaEntidade(dto, produto);
        
        if (produto.getQuantidadeEstoque() == null) {
            produto.setQuantidadeEstoque(0);
        }
        
        Produto salvo = produtoRepository.save(produto);
        return mapearEntidadeParaDto(salvo);
    }

    public List<ProdutoResponseDTO> listarProdutos() {
        return produtoRepository.findAll().stream()
                .map(this::mapearEntidadeParaDto)
                .collect(Collectors.toList());
    }

    public ProdutoResponseDTO buscarProdutoPorId(Integer id) {
        return produtoRepository.findById(id)
                .map(this::mapearEntidadeParaDto)
                .orElse(null);
    }

    @Transactional
    public ProdutoResponseDTO atualizarProduto(Integer id, ProdutoRequestDTO dto) {
        Produto produtoExistente = produtoRepository.findById(id).orElse(null);
        if (produtoExistente == null) return null;

        mapearDtoParaEntidade(dto, produtoExistente);
        
        Produto atualizado = produtoRepository.save(produtoExistente);
        return mapearEntidadeParaDto(atualizado);
    }

    @Transactional
    public boolean deletarProduto(Integer id) {
        if (produtoRepository.existsById(id)) {
            produtoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private void mapearDtoParaEntidade(ProdutoRequestDTO dto, Produto entidade) {
        entidade.setNomeProduto(dto.getNomeProduto());
        entidade.setCodigoBarras(dto.getCodigoBarras());
        entidade.setImagem(dto.getImagem());
        entidade.setDiasValidadePadrao(dto.getDiasValidadePadrao());
        entidade.setPercentualICMS(dto.getPercentualICMS());
        entidade.setPercentualLucroBalcao(dto.getPercentualLucroBalcao());
        entidade.setPercentualLucroAtacado(dto.getPercentualLucroAtacado());
        entidade.setPrecoBalcao(dto.getPrecoBalcao());
        entidade.setPrecoAtacado(dto.getPrecoAtacado());
        if (dto.getQuantidadeEstoque() != null) {
            entidade.setQuantidadeEstoque(dto.getQuantidadeEstoque());
        }
    }

    private ProdutoResponseDTO mapearEntidadeParaDto(Produto entidade) {
        ProdutoResponseDTO dto = new ProdutoResponseDTO();
        dto.setIdProduto(entidade.getIdProduto()); 
        dto.setNomeProduto(entidade.getNomeProduto());
        dto.setImagem(entidade.getImagem());
        dto.setCodigoBarras(entidade.getCodigoBarras());
        dto.setDiasValidadePadrao(entidade.getDiasValidadePadrao());
        dto.setPercentualICMS(entidade.getPercentualICMS());
        dto.setPercentualLucroBalcao(entidade.getPercentualLucroBalcao());
        dto.setPercentualLucroAtacado(entidade.getPercentualLucroAtacado());
        dto.setPrecoBalcao(entidade.getPrecoBalcao());
        dto.setPrecoAtacado(entidade.getPrecoAtacado());
        dto.setQuantidadeEstoque(entidade.getQuantidadeEstoque());
        return dto;
    }
}