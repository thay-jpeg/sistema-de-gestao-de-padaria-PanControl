package com.padaria.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CompraIngredienteResponseDTO {
    private Integer idCompras;
    private BigDecimal quantidadeComprada;
    private BigDecimal quantidadeRestante;
    private LocalDate dataValidade;
    private BigDecimal custoTotal;
    private LocalDateTime dataCompra;
    private Integer idIngrediente;
    private String nomeIngrediente;

    public Integer getIdCompras() { return idCompras; } public void setIdCompras(Integer idCompras) { this.idCompras = idCompras; }
    public BigDecimal getQuantidadeComprada() { return quantidadeComprada; } public void setQuantidadeComprada(BigDecimal quantidadeComprada) { this.quantidadeComprada = quantidadeComprada; }
    public BigDecimal getQuantidadeRestante() { return quantidadeRestante; } public void setQuantidadeRestante(BigDecimal quantidadeRestante) { this.quantidadeRestante = quantidadeRestante; }
    public LocalDate getDataValidade() { return dataValidade; } public void setDataValidade(LocalDate dataValidade) { this.dataValidade = dataValidade; }
    public BigDecimal getCustoTotal() { return custoTotal; } public void setCustoTotal(BigDecimal custoTotal) { this.custoTotal = custoTotal; }
    public LocalDateTime getDataCompra() { return dataCompra; } public void setDataCompra(LocalDateTime dataCompra) { this.dataCompra = dataCompra; }
    public Integer getIdIngrediente() { return idIngrediente; } public void setIdIngrediente(Integer idIngrediente) { this.idIngrediente = idIngrediente; }
    public String getNomeIngrediente() { return nomeIngrediente; } public void setNomeIngrediente(String nomeIngrediente) { this.nomeIngrediente = nomeIngrediente; }
}