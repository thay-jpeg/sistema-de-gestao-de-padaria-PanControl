package com.padaria.backend.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.padaria.backend.dto.IngredienteRelatorioDTO;
import com.padaria.backend.dto.IngredienteRequestDTO;
import com.padaria.backend.dto.IngredienteResponseDTO;
import com.padaria.backend.model.Ingrediente;
import com.padaria.backend.repository.IngredienteRepository;
import com.padaria.backend.repository.RelatorioIngredienteProjection;

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

    public List<IngredienteRelatorioDTO> gerarRelatorio(String dataInicio, String dataFim) {
        String inicio = (dataInicio != null && !dataInicio.trim().isEmpty()) ? dataInicio : null;
        String fim = (dataFim != null && !dataFim.trim().isEmpty()) ? dataFim : null;

        List<RelatorioIngredienteProjection> resultados = ingredienteRepository.buscarRelatorioComFiltro(inicio, fim);
        List<IngredienteRelatorioDTO> relatorio = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

        for (RelatorioIngredienteProjection proj : resultados) {
            IngredienteRelatorioDTO dto = new IngredienteRelatorioDTO();
            dto.setIdIngrediente(proj.getIdIngrediente());
            dto.setDescricao(proj.getNome() + " (" + proj.getMedida() + ")");
            dto.setCustoMedio(proj.getCusto());
            dto.setEstoque(proj.getEstoque());

            if (proj.getValidade() != null) {
                dto.setValidadeLote(sdf.format(proj.getValidade()));
            } else {
                dto.setValidadeLote("Sem compra reg.");
            }

            if (proj.getEstoque().compareTo(proj.getMinimo()) <= 0) {
                dto.setStatus("ALERTA");
            } else {
                dto.setStatus("OK");
            }

            relatorio.add(dto);
        }

        return relatorio;
    }
}