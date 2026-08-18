package com.padaria.backend.dto;

import java.time.LocalDateTime;

public class PerdaProdutoResponseDTO {
    private Integer idPerdaProduto;
    private Integer quantidadePerdida;
    private String motivoPerda;
    private LocalDateTime dataPerda;
    private Integer idProducao;
    private Integer idProduto;
    private Integer idUsuario;

    public Integer getIdPerdaProduto() { return idPerdaProduto; } public void setIdPerdaProduto(Integer idPerdaProduto) { this.idPerdaProduto = idPerdaProduto; }
    public Integer getQuantidadePerdida() { return quantidadePerdida; } public void setQuantidadePerdida(Integer quantidadePerdida) { this.quantidadePerdida = quantidadePerdida; }
    public String getMotivoPerda() { return motivoPerda; } public void setMotivoPerda(String motivoPerda) { this.motivoPerda = motivoPerda; }
    public LocalDateTime getDataPerda() { return dataPerda; } public void setDataPerda(LocalDateTime dataPerda) { this.dataPerda = dataPerda; }
    public Integer getIdProducao() { return idProducao; } public void setIdProducao(Integer idProducao) { this.idProducao = idProducao; }
    public Integer getIdProduto() { return idProduto; } public void setIdProduto(Integer idProduto) { this.idProduto = idProduto; }
    public Integer getIdUsuario() { return idUsuario; } public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
}
