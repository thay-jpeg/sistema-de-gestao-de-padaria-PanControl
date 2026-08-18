package com.padaria.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProducaoRequestDTO {
    private Integer quantidadeProduzida;
    private LocalDate dataValidade;
    private LocalDateTime dataProducao;
    private Integer idProduto;
    private Integer idUsuario;
    private BigDecimal custoTotalProducao;

    public Integer getQuantidadeProduzida() { return quantidadeProduzida; } public void setQuantidadeProduzida(Integer quantidadeProduzida) { this.quantidadeProduzida = quantidadeProduzida; }
    public BigDecimal getCustoTotalProducao() { return custoTotalProducao; } public void setCustoTotalProducao(BigDecimal custoTotalProducao) { this.custoTotalProducao = custoTotalProducao  ; }
    public LocalDate getDataValidade() { return dataValidade; } public void setDataValidade(LocalDate dataValidade) { this.dataValidade = dataValidade; }
    public LocalDateTime getDataProducao() { return dataProducao; } public void setDataProducao(LocalDateTime dataProducao) { this.dataProducao = dataProducao; }
    public Integer getIdProduto() { return idProduto; } public void setIdProduto(Integer idProduto) { this.idProduto = idProduto; }
    public Integer getIdUsuario() { return idUsuario; } public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
}