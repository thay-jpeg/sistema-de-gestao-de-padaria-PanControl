package com.padaria.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.padaria.backend.dto.ProducaoRequestDTO;
import com.padaria.backend.dto.ProducaoResponseDTO;
import com.padaria.backend.model.Producao;
import com.padaria.backend.model.Produto;
import com.padaria.backend.model.Usuario;
import com.padaria.backend.repository.ProducaoRepository;
import com.padaria.backend.repository.ProdutoRepository;
import com.padaria.backend.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
public class ProducaoService {

    @Autowired private ProducaoRepository producaoRepo;
    @Autowired private ProdutoRepository produtoRepo;
    @Autowired private UsuarioRepository usuarioRepo;

    @Transactional
    public ProducaoResponseDTO registrarProducao(ProducaoRequestDTO dto) {
        Producao producao = new Producao();
        mapearDtoParaEntidade(dto, producao);

        if (producao.getDataProducao() == null) {
            producao.setDataProducao(LocalDateTime.now());
        }
        
        Produto produto = producao.getProduto();
        Integer estoqueAtual = produto.getQuantidadeEstoque() != null ? produto.getQuantidadeEstoque() : 0;
        produto.setQuantidadeEstoque(estoqueAtual + dto.getQuantidadeProduzida());
        produtoRepo.save(produto);

        Producao salva = producaoRepo.save(producao);
        return mapearEntidadeParaDto(salva);
    }

    public List<ProducaoResponseDTO> listarProducoes() {
        return producaoRepo.findAll().stream().map(this::mapearEntidadeParaDto).collect(Collectors.toList());
    }

    public List<ProducaoResponseDTO> listarPorProduto(Integer idProduto) {
        return producaoRepo.findByProdutoIdProduto(idProduto).stream().map(this::mapearEntidadeParaDto).collect(Collectors.toList());
    }

    public ProducaoResponseDTO buscarProducaoPorId(Integer id) {
        return producaoRepo.findById(id).map(this::mapearEntidadeParaDto).orElse(null);
    }

    @Transactional
    public boolean deletarProducao(Integer id) {
        if (producaoRepo.existsById(id)) {
            producaoRepo.deleteById(id);
            return true;
        }
        return false;
    }

private void mapearDtoParaEntidade(ProducaoRequestDTO dto, Producao entidade) {
        entidade.setQuantidadeProduzida(dto.getQuantidadeProduzida());
        entidade.setCustoTotalProducao(dto.getCustoTotalProducao());
        entidade.setDataValidade(dto.getDataValidade());
        entidade.setDataProducao(dto.getDataProducao());
        
        Produto produto = produtoRepo.findById(dto.getIdProduto()).orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));
        Usuario usuario = usuarioRepo.findById(dto.getIdUsuario()).orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        
        entidade.setProduto(produto);
        entidade.setUsuario(usuario);
    }

    private ProducaoResponseDTO mapearEntidadeParaDto(Producao entidade) {
        ProducaoResponseDTO dto = new ProducaoResponseDTO();
        dto.setIdProducao(entidade.getIdProducao()); 
        dto.setQuantidadeProduzida(entidade.getQuantidadeProduzida());
        dto.setCustoTotalProducao(entidade.getCustoTotalProducao());
        dto.setDataValidade(entidade.getDataValidade());
        dto.setDataProducao(entidade.getDataProducao());
        dto.setIdProduto(entidade.getProduto().getIdProduto());
        dto.setIdUsuario(entidade.getUsuario().getIdUsuario());
        return dto;
    }
    }