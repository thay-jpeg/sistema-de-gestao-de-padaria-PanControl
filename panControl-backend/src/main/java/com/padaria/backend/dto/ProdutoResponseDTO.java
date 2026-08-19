package com.padaria.backend.dto;

import java.math.BigDecimal;

public class ProdutoResponseDTO {
    private Integer idProduto;
    private String nomeProduto;
    private String codigoBarras;
    private Integer diasValidadePadrao;
    private BigDecimal percentualICMS;
    private BigDecimal percentualLucroBalcao;
    private BigDecimal percentualLucroAtacado;
    private BigDecimal precoBalcao;
    private String imagem;
    private BigDecimal precoAtacado;
    private Integer quantidadeEstoque;

    public Integer getIdProduto() { return idProduto; } public void setIdProduto(Integer idProduto) { this.idProduto = idProduto; }
    public String getNomeProduto() { return nomeProduto; } public void setNomeProduto(String nomeProduto) { this.nomeProduto = nomeProduto; }
    public String getImagem() { return imagem; } public void setImagem(String imagem) { this.imagem = imagem; }
    public String getCodigoBarras() { return codigoBarras; } public void setCodigoBarras(String codigoBarras) { this.codigoBarras = codigoBarras; }
    public Integer getDiasValidadePadrao() { return diasValidadePadrao; } public void setDiasValidadePadrao(Integer diasValidadePadrao) { this.diasValidadePadrao = diasValidadePadrao; }
    public BigDecimal getPercentualICMS() { return percentualICMS; } public void setPercentualICMS(BigDecimal percentualICMS) { this.percentualICMS = percentualICMS; }
    public BigDecimal getPercentualLucroBalcao() { return percentualLucroBalcao; } public void setPercentualLucroBalcao(BigDecimal percentualLucroBalcao) { this.percentualLucroBalcao = percentualLucroBalcao; }
    public BigDecimal getPercentualLucroAtacado() { return percentualLucroAtacado; } public void setPercentualLucroAtacado(BigDecimal percentualLucroAtacado) { this.percentualLucroAtacado = percentualLucroAtacado; }
    public BigDecimal getPrecoBalcao() { return precoBalcao; } public void setPrecoBalcao(BigDecimal precoBalcao) { this.precoBalcao = precoBalcao; }
    public BigDecimal getPrecoAtacado() { return precoAtacado; } public void setPrecoAtacado(BigDecimal precoAtacado) { this.precoAtacado = precoAtacado; }
    public Integer getQuantidadeEstoque() { return quantidadeEstoque; } public void setQuantidadeEstoque(Integer quantidadeEstoque) { this.quantidadeEstoque = quantidadeEstoque; }
}