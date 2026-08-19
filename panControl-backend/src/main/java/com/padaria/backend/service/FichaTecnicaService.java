package com.padaria.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import com.padaria.backend.repository.IngredienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.padaria.backend.dto.FichaTecnicaRequestDTO;
import com.padaria.backend.dto.FichaTecnicaResponseDTO;
import com.padaria.backend.model.FichaTecnica;
import com.padaria.backend.model.Ingrediente;
import com.padaria.backend.model.Produto;
import com.padaria.backend.repository.FichaTecnicaRepository;
import com.padaria.backend.repository.ProdutoRepository;

import jakarta.transaction.Transactional;

@Service
public class FichaTecnicaService {

    @Autowired private FichaTecnicaRepository fichaRepo;
    @Autowired private ProdutoRepository produtoRepo;
    @Autowired private IngredienteRepository ingredienteRepo;

    @Transactional
    public FichaTecnicaResponseDTO criarFichaTecnica(FichaTecnicaRequestDTO dto) {
        FichaTecnica ficha = new FichaTecnica();
        mapearDtoParaEntidade(dto, ficha);
        FichaTecnica salva = fichaRepo.save(ficha);
        return mapearEntidadeParaDto(salva);
    }

    public List<FichaTecnicaResponseDTO> listarFichas() {
        return fichaRepo.findAll().stream().map(this::mapearEntidadeParaDto).collect(Collectors.toList());
    }

    public List<FichaTecnicaResponseDTO> listarFichasPorProduto(Integer idProduto) {
        return fichaRepo.findByProdutoIdProduto(idProduto).stream().map(this::mapearEntidadeParaDto).collect(Collectors.toList());
    }

    public FichaTecnicaResponseDTO buscarFichaPorId(Integer id) {
        return fichaRepo.findById(id).map(this::mapearEntidadeParaDto).orElse(null);
    }

    @Transactional
    public FichaTecnicaResponseDTO atualizarFicha(Integer id, FichaTecnicaRequestDTO dto) {
        FichaTecnica fichaExistente = fichaRepo.findById(id).orElse(null);
        if (fichaExistente == null) return null;

        fichaExistente.setTextoReceita(dto.getTextoReceita());
        fichaExistente.setQuantidadeNecessaria(dto.getQuantidadeNecessaria());
        
        FichaTecnica atualizada = fichaRepo.save(fichaExistente);
        return mapearEntidadeParaDto(atualizada);
    }

    @Transactional
    public boolean deletarFicha(Integer id) {
        if (fichaRepo.existsById(id)) {
            fichaRepo.deleteById(id);
            return true;
        }
        return false;
    }

    private void mapearDtoParaEntidade(FichaTecnicaRequestDTO dto, FichaTecnica entidade) {
        entidade.setTextoReceita(dto.getTextoReceita());
        entidade.setQuantidadeNecessaria(dto.getQuantidadeNecessaria());
        
        // Busca as entidades reais no banco usando os IDs do DTO
        Produto produto = produtoRepo.findById(dto.getIdProduto()).orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));
        Ingrediente ingrediente = ingredienteRepo.findById(dto.getIdIngrediente()).orElseThrow(() -> new IllegalArgumentException("Ingrediente não encontrado"));
        
        entidade.setProduto(produto);
        entidade.setIngrediente(ingrediente);
    }

    private FichaTecnicaResponseDTO mapearEntidadeParaDto(FichaTecnica entidade) {
        FichaTecnicaResponseDTO dto = new FichaTecnicaResponseDTO();
        dto.setIdFichaTecnica(entidade.getIdFichaTecnica());
        dto.setIdProduto(entidade.getProduto().getIdProduto());
        dto.setIdIngrediente(entidade.getIngrediente().getIdIngrediente());
        dto.setTextoReceita(entidade.getTextoReceita());
        dto.setQuantidadeNecessaria(entidade.getQuantidadeNecessaria());
        return dto;
    }
}