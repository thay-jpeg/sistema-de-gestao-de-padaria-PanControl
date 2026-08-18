package com.padaria.backend.dto;

import java.math.BigDecimal;

public class IngredienteRequestDTO {
    private String nomeIngrediente;
    private String unidadeMedida;
    private BigDecimal quantidadeEstoque;
    private BigDecimal estoqueMinimo;
    private BigDecimal custoMedioUnitario;

    public String getNomeIngrediente() { return nomeIngrediente; } public void setNomeIngrediente(String nomeIngrediente) { this.nomeIngrediente = nomeIngrediente; }
    public String getUnidadeMedida() { return unidadeMedida; } public void setUnidadeMedida(String unidadeMedida) { this.unidadeMedida = unidadeMedida; }
    public BigDecimal getQuantidadeEstoque() { return quantidadeEstoque; } public void setQuantidadeEstoque(BigDecimal quantidadeEstoque) { this.quantidadeEstoque = quantidadeEstoque; }
    public BigDecimal getEstoqueMinimo() { return estoqueMinimo; } public void setEstoqueMinimo(BigDecimal estoqueMinimo) { this.estoqueMinimo = estoqueMinimo; }
    public BigDecimal getCustoMedioUnitario() { return custoMedioUnitario; } public void setCustoMedioUnitario(BigDecimal custoMedioUnitario) { this.custoMedioUnitario = custoMedioUnitario; }
}