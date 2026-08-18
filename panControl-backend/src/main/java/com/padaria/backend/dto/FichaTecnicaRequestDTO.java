package com.padaria.backend.dto;

import java.math.BigDecimal;

public class FichaTecnicaRequestDTO {
    private Integer idProduto;
    private Integer idIngrediente;
    private String textoReceita;
    private BigDecimal quantidadeNecessaria;

    public Integer getIdProduto() { return idProduto; } public void setIdProduto(Integer idProduto) { this.idProduto = idProduto; }
    public Integer getIdIngrediente() { return idIngrediente; } public void setIdIngrediente(Integer idIngrediente) { this.idIngrediente = idIngrediente; }
    public String getTextoReceita() { return textoReceita; } public void setTextoReceita(String textoReceita) { this.textoReceita = textoReceita; }
    public BigDecimal getQuantidadeNecessaria() { return quantidadeNecessaria; } public void setQuantidadeNecessaria(BigDecimal quantidadeNecessaria) { this.quantidadeNecessaria = quantidadeNecessaria; }
}