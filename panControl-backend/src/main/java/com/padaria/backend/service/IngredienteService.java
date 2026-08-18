package com.padaria.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.padaria.backend.dto.IngredienteRequestDTO;
import com.padaria.backend.dto.IngredienteResponseDTO;
import com.padaria.backend.model.Ingrediente;
import com.padaria.backend.repository.IngredienteRepository;

import jakarta.transaction.Transactional;

@Service
public class IngredienteService {

    @Autowired
    private IngredienteRepository ingredienteRepository;

    @Transactional
    public IngredienteResponseDTO criarIngrediente(IngredienteRequestDTO dto) {
        Ingrediente ingrediente = new Ingrediente();
        mapearDtoParaEntidade(dto, ingrediente);
        Ingrediente salvo = ingredienteRepository.save(ingrediente);
        return mapearEntidadeParaDto(salvo);
    }

    public List<IngredienteResponseDTO> listarIngredientes() {
        return ingredienteRepository.findAll().stream()
                .map(this::mapearEntidadeParaDto)
                .collect(Collectors.toList());
    }

    public IngredienteResponseDTO buscarIngredientePorId(Integer id) {
        return ingredienteRepository.findById(id)
                .map(this::mapearEntidadeParaDto)
                .orElse(null);
    }

    @Transactional
    public IngredienteResponseDTO atualizarIngrediente(Integer id, IngredienteRequestDTO dto) {
        Ingrediente ingredienteExistente = ingredienteRepository.findById(id).orElse(null);
        if (ingredienteExistente == null) return null;

        mapearDtoParaEntidade(dto, ingredienteExistente);
        
        Ingrediente atualizado = ingredienteRepository.save(ingredienteExistente);
        return mapearEntidadeParaDto(atualizado);
    }

    @Transactional
    public boolean deletarIngrediente(Integer id) {
        if (ingredienteRepository.existsById(id)) {
            ingredienteRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private void mapearDtoParaEntidade(IngredienteRequestDTO dto, Ingrediente entidade) {
        entidade.setNomeIngrediente(dto.getNomeIngrediente());
        entidade.setUnidadeMedida(dto.getUnidadeMedida());
        entidade.setImagem(dto.getImagem());
        entidade.setQuantidadeEstoque(dto.getQuantidadeEstoque());
        entidade.setEstoqueMinimo(dto.getEstoqueMinimo());
        entidade.setCustoMedioUnitario(dto.getCustoMedioUnitario());
    }

    private IngredienteResponseDTO mapearEntidadeParaDto(Ingrediente entidade) {
        IngredienteResponseDTO dto = new IngredienteResponseDTO();
        dto.setIdIngrediente(entidade.getIdIngrediente());
        dto.setNomeIngrediente(entidade.getNomeIngrediente());
        dto.setImagem(entidade.getImagem());
        dto.setUnidadeMedida(entidade.getUnidadeMedida());
        dto.setQuantidadeEstoque(entidade.getQuantidadeEstoque());
        dto.setEstoqueMinimo(entidade.getEstoqueMinimo());
        dto.setCustoMedioUnitario(entidade.getCustoMedioUnitario());
        return dto;
    }
}