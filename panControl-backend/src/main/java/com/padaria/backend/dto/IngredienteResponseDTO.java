package com.padaria.backend.dto;

import java.math.BigDecimal;

public class IngredienteResponseDTO {
    private Integer idIngrediente;
    private String nomeIngrediente;
    private String imagem;
    private String unidadeMedida;
    private BigDecimal quantidadeEstoque;
    private BigDecimal estoqueMinimo;
    private BigDecimal custoMedioUnitario;

    public Integer getIdIngrediente() { return idIngrediente; } public void setIdIngrediente(Integer idIngrediente) { this.idIngrediente = idIngrediente; }
    public String getNomeIngrediente() { return nomeIngrediente; } public void setNomeIngrediente(String nomeIngrediente) { this.nomeIngrediente = nomeIngrediente; }
    public String getImagem() { return imagem; } public void setImagem(String imagem) { this.imagem = imagem; }
    public String getUnidadeMedida() { return unidadeMedida; } public void setUnidadeMedida(String unidadeMedida) { this.unidadeMedida = unidadeMedida; }
    public BigDecimal getQuantidadeEstoque() { return quantidadeEstoque; } public void setQuantidadeEstoque(BigDecimal quantidadeEstoque) { this.quantidadeEstoque = quantidadeEstoque; }
    public BigDecimal getEstoqueMinimo() { return estoqueMinimo; } public void setEstoqueMinimo(BigDecimal estoqueMinimo) { this.estoqueMinimo = estoqueMinimo; }
    public BigDecimal getCustoMedioUnitario() { return custoMedioUnitario; } public void setCustoMedioUnitario(BigDecimal custoMedioUnitario) { this.custoMedioUnitario = custoMedioUnitario; }
}