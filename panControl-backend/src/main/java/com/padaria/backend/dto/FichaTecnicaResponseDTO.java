package com.padaria.backend.dto;

import java.math.BigDecimal;

public class FichaTecnicaResponseDTO {
    private Integer idFichaTecnica;
    private Integer idProduto;
    private Integer idIngrediente;
    private String textoReceita;
    private BigDecimal quantidadeNecessaria;

    public Integer getIdFichaTecnica() { return idFichaTecnica; } public void setIdFichaTecnica(Integer idFichaTecnica) { this.idFichaTecnica = idFichaTecnica; }
    public Integer getIdProduto() { return idProduto; } public void setIdProduto(Integer idProduto) { this.idProduto = idProduto; }
    public Integer getIdIngrediente() { return idIngrediente; } public void setIdIngrediente(Integer idIngrediente) { this.idIngrediente = idIngrediente; }
    public String getTextoReceita() { return textoReceita; } public void setTextoReceita(String textoReceita) { this.textoReceita = textoReceita; }
    public BigDecimal getQuantidadeNecessaria() { return quantidadeNecessaria; } public void setQuantidadeNecessaria(BigDecimal quantidadeNecessaria) { this.quantidadeNecessaria = quantidadeNecessaria; }
}