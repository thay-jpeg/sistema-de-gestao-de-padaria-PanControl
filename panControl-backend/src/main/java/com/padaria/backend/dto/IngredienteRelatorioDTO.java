package com.padaria.backend.dto;

import java.math.BigDecimal;

public class IngredienteRelatorioDTO {
    private Integer idIngrediente;
    private String descricao;
    private BigDecimal custoMedio;
    private BigDecimal estoque;
    private String validadeLote; // Novo campo para a data
    private String status;

    // --- Getters e Setters ---
    public Integer getIdIngrediente() { return idIngrediente; }
    public void setIdIngrediente(Integer idIngrediente) { this.idIngrediente = idIngrediente; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public BigDecimal getCustoMedio() { return custoMedio; }
    public void setCustoMedio(BigDecimal custoMedio) { this.custoMedio = custoMedio; }

    public BigDecimal getEstoque() { return estoque; }
    public void setEstoque(BigDecimal estoque) { this.estoque = estoque; }

    public String getValidadeLote() { return validadeLote; }
    public void setValidadeLote(String validadeLote) { this.validadeLote = validadeLote; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}