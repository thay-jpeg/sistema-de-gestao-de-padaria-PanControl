package com.padaria.backend.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "produtos")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"idProduto_PK\"")
    private Integer idProduto;

    @Column(name = "\"nomeProduto\"", nullable = false)
    private String nomeProduto;

    @Column(name = "\"codigoBarras\"", unique = true)
    private String codigoBarras;

    @Column(name = "\"diasValidadePadrao\"", nullable = false)
    private Integer diasValidadePadrao;

    @Column(name = "imagem", columnDefinition = "TEXT")
    private String imagem;

    @Column(name = "\"percentualICMS\"", nullable = false, precision = 5, scale = 2)
    private BigDecimal percentualICMS;

    @Column(name = "\"percentualLucroBalcao\"", nullable = false, precision = 5, scale = 2)
    private BigDecimal percentualLucroBalcao;

    @Column(name = "\"percentualLucroAtacado\"", nullable = false, precision = 5, scale = 2)
    private BigDecimal percentualLucroAtacado;

    @Column(name = "\"precoBalcao\"", nullable = false, precision = 10, scale = 2)
    private BigDecimal precoBalcao;

    @Column(name = "\"precoAtacado\"", nullable = false, precision = 10, scale = 2)
    private BigDecimal precoAtacado;

    @Column(name = "\"quantidadeEstoque\"", nullable = false)
    private Integer quantidadeEstoque = 0;

    public Produto() {}

    // Getters e Setters
    public Integer getIdProduto() { return idProduto; }
    public void setIdProduto(Integer idProduto) { this.idProduto = idProduto; }

    public String getNomeProduto() { return nomeProduto; }
    public void setNomeProduto(String nomeProduto) { this.nomeProduto = nomeProduto; }

    public String getImagem() { return imagem; }
    public void setImagem(String imagem) { this.imagem = imagem; }

    public String getCodigoBarras() { return codigoBarras; }
    public void setCodigoBarras(String codigoBarras) { this.codigoBarras = codigoBarras; }

    public Integer getDiasValidadePadrao() { return diasValidadePadrao; }
    public void setDiasValidadePadrao(Integer diasValidadePadrao) { this.diasValidadePadrao = diasValidadePadrao; }

    public BigDecimal getPercentualICMS() { return percentualICMS; }
    public void setPercentualICMS(BigDecimal percentualICMS) { this.percentualICMS = percentualICMS; }

    public BigDecimal getPercentualLucroBalcao() { return percentualLucroBalcao; }
    public void setPercentualLucroBalcao(BigDecimal percentualLucroBalcao) { this.percentualLucroBalcao = percentualLucroBalcao; }

    public BigDecimal getPercentualLucroAtacado() { return percentualLucroAtacado; }
    public void setPercentualLucroAtacado(BigDecimal percentualLucroAtacado) { this.percentualLucroAtacado = percentualLucroAtacado; }

    public BigDecimal getPrecoBalcao() { return precoBalcao; }
    public void setPrecoBalcao(BigDecimal precoBalcao) { this.precoBalcao = precoBalcao; }

    public BigDecimal getPrecoAtacado() { return precoAtacado; }
    public void setPrecoAtacado(BigDecimal precoAtacado) { this.precoAtacado = precoAtacado; }

    public Integer getQuantidadeEstoque() { return quantidadeEstoque; }
    public void setQuantidadeEstoque(Integer quantidadeEstoque) { this.quantidadeEstoque = quantidadeEstoque; }
}