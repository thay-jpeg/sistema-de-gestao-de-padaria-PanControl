package com.padaria.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CompraIngredienteRequestDTO {
    private BigDecimal quantidadeComprada;
    private LocalDate dataValidade;
    private BigDecimal custoTotal;
    private LocalDateTime dataCompra;
    private Integer idUsuario;
    private Integer idIngrediente;

    public BigDecimal getQuantidadeComprada() { return quantidadeComprada; } public void setQuantidadeComprada(BigDecimal quantidadeComprada) { this.quantidadeComprada = quantidadeComprada; }
    public LocalDate getDataValidade() { return dataValidade; } public void setDataValidade(LocalDate dataValidade) { this.dataValidade = dataValidade; }
    public BigDecimal getCustoTotal() { return custoTotal; } public void setCustoTotal(BigDecimal custoTotal) { this.custoTotal = custoTotal; }
    public LocalDateTime getDataCompra() { return dataCompra; } public void setDataCompra(LocalDateTime dataCompra) { this.dataCompra = dataCompra; }
    public Integer getIdUsuario() { return idUsuario; } public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
    public Integer getIdIngrediente() { return idIngrediente; } public void setIdIngrediente(Integer idIngrediente) { this.idIngrediente = idIngrediente; }
}