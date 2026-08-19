package com.padaria.backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.padaria.backend.dto.CompraIngredienteRequestDTO;
import com.padaria.backend.dto.CompraIngredienteResponseDTO;
import com.padaria.backend.model.CompraIngrediente;
import com.padaria.backend.model.Ingrediente;
import com.padaria.backend.model.Usuario;
import com.padaria.backend.repository.CompraIngredienteRepository;
import com.padaria.backend.repository.IngredienteRepository;
import com.padaria.backend.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
public class CompraIngredienteService {

    @Autowired private CompraIngredienteRepository compraRepo;
    @Autowired private IngredienteRepository ingredienteRepo;
    @Autowired private UsuarioRepository usuarioRepo;

@Transactional
    public CompraIngredienteResponseDTO registrarCompra(CompraIngredienteRequestDTO dto) {
        CompraIngrediente compra = new CompraIngrediente();
        
        compra.setQuantidadeComprada(dto.getQuantidadeComprada());
        compra.setCustoTotal(dto.getCustoTotal());
        compra.setDataValidade(dto.getDataValidade());
        compra.setDataCompra(dto.getDataCompra() != null ? dto.getDataCompra() : LocalDateTime.now());
        compra.setQuantidadeRestante(dto.getQuantidadeComprada());
        
        Usuario usuario = usuarioRepo.findById(dto.getIdUsuario()).orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        Ingrediente ingrediente = ingredienteRepo.findById(dto.getIdIngrediente()).orElseThrow(() -> new IllegalArgumentException("Ingrediente não encontrado"));
        
        // att de estoque e custo medio unitário do ingrediente
        BigDecimal estoqueAtual = ingrediente.getQuantidadeEstoque() != null ? ingrediente.getQuantidadeEstoque() : BigDecimal.ZERO;
        BigDecimal custoAtual = ingrediente.getCustoMedioUnitario() != null ? ingrediente.getCustoMedioUnitario() : BigDecimal.ZERO;
        
        BigDecimal novoEstoque = estoqueAtual.add(dto.getQuantidadeComprada());
        
        // estoque atual * custo atual) + custo do novo estoque
        BigDecimal valorTotalEstoqueAnterior = estoqueAtual.multiply(custoAtual);
        BigDecimal valorEstoqueAtualizado = valorTotalEstoqueAnterior.add(dto.getCustoTotal());
        
        // divide o valor total pelo novo estoque
        BigDecimal novoCustoMedio = valorEstoqueAtualizado.divide(novoEstoque, 4, RoundingMode.HALF_UP);
        
        // att ingrediente
        ingrediente.setQuantidadeEstoque(novoEstoque);
        ingrediente.setCustoMedioUnitario(novoCustoMedio);
        ingredienteRepo.save(ingrediente);

        compra.setUsuario(usuario);
        compra.setIngrediente(ingrediente);
        
        return mapearParaDto(compraRepo.save(compra));
    }

    public List<CompraIngredienteResponseDTO> listarCompras() {
        return compraRepo.findAll().stream().map(this::mapearParaDto).collect(Collectors.toList());
    }

    private CompraIngredienteResponseDTO mapearParaDto(CompraIngrediente entidade) {
        CompraIngredienteResponseDTO dto = new CompraIngredienteResponseDTO();
        dto.setIdCompras(entidade.getIdCompras());
        dto.setQuantidadeComprada(entidade.getQuantidadeComprada());
        dto.setQuantidadeRestante(entidade.getQuantidadeRestante());
        dto.setCustoTotal(entidade.getCustoTotal());
        dto.setDataValidade(entidade.getDataValidade());
        dto.setDataCompra(entidade.getDataCompra());
        dto.setIdIngrediente(entidade.getIngrediente().getIdIngrediente());
        dto.setNomeIngrediente(entidade.getIngrediente().getNomeIngrediente());
        return dto;
    }
}