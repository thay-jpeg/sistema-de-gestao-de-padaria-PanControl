package com.padaria.backend.service;

import com.padaria.backend.dto.IngredienteRelatorioDTO;
import com.padaria.backend.dto.IngredienteRequestDTO;
import com.padaria.backend.dto.IngredienteResponseDTO;
import com.padaria.backend.model.Ingrediente;
import com.padaria.backend.repository.IngredienteRepository;
import com.padaria.backend.repository.RelatorioIngredienteProjection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IngredienteService {

    @Autowired
    private IngredienteRepository ingredienteRepository;

    // ========================================================================
    // MÉTODOS DE CRUD (Para o IngredienteController)
    // ========================================================================

    public IngredienteResponseDTO criarIngrediente(IngredienteRequestDTO dto) {
        Ingrediente ingrediente = new Ingrediente();

        ingrediente.setNomeIngrediente(dto.getNomeIngrediente());
        ingrediente.setUnidadeMedida(dto.getUnidadeMedida());
        ingrediente.setQuantidadeEstoque(dto.getQuantidadeEstoque());
        ingrediente.setEstoqueMinimo(dto.getEstoqueMinimo());
        ingrediente.setCustoMedioUnitario(dto.getCustoMedioUnitario());

        Ingrediente salvo = ingredienteRepository.save(ingrediente);
        return mapearParaResponseDTO(salvo);
    }

    public List<IngredienteResponseDTO> listarIngredientes() {
        return ingredienteRepository.findAll().stream()
                .map(this::mapearParaResponseDTO)
                .collect(Collectors.toList());
    }

    public IngredienteResponseDTO buscarIngredientePorId(Integer id) {
        Ingrediente ingrediente = ingredienteRepository.findById(id).orElse(null);
        if (ingrediente != null) {
            return mapearParaResponseDTO(ingrediente);
        }
        return null;
    }


    public IngredienteResponseDTO atualizarIngrediente(Integer id, IngredienteRequestDTO dto) {
        Ingrediente ingrediente = ingredienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingrediente não encontrado!"));

        ingrediente.setNomeIngrediente(dto.getNomeIngrediente());
        ingrediente.setUnidadeMedida(dto.getUnidadeMedida());
        ingrediente.setQuantidadeEstoque(dto.getQuantidadeEstoque());
        ingrediente.setEstoqueMinimo(dto.getEstoqueMinimo());
        ingrediente.setCustoMedioUnitario(dto.getCustoMedioUnitario());

        Ingrediente atualizado = ingredienteRepository.save(ingrediente);
        return mapearParaResponseDTO(atualizado);
    }


    public boolean deletarIngrediente(Integer id) {
        if (ingredienteRepository.existsById(id)) {
            ingredienteRepository.deleteById(id);
            return true; // Retorna true se encontrou e deletou com sucesso
        }
        return false; // Retorna false se o ID não existia no banco
    }

    // Função auxiliar de mapeamento
    private IngredienteResponseDTO mapearParaResponseDTO(Ingrediente ing) {
        IngredienteResponseDTO dto = new IngredienteResponseDTO();
        dto.setIdIngrediente(ing.getIdIngrediente());
        dto.setNomeIngrediente(ing.getNomeIngrediente());
        dto.setUnidadeMedida(ing.getUnidadeMedida());
        dto.setQuantidadeEstoque(ing.getQuantidadeEstoque());
        dto.setEstoqueMinimo(ing.getEstoqueMinimo());
        dto.setCustoMedioUnitario(ing.getCustoMedioUnitario());
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