package com.padaria.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "produtos")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProduto_PK;

    private String nomeProduto;
    private Double precoBalcao;
    private Double precoAtacado;
    private Double quantidadeEstoque;

    // Getters e Setters

    public Long getIdProduto_PK() {
        return idProduto_PK;
    }

    public void setIdProduto_PK(Long idProduto_PK) {
        this.idProduto_PK = idProduto_PK;
    }

    public String getNomeProduto() {
        return nomeProduto;
    }

    public void setNomeProduto(String nomeProduto) {
        this.nomeProduto = nomeProduto;
    }

    public Double getPrecoBalcao() {
        return precoBalcao;
    }

    public void setPrecoBalcao(Double precoBalcao) {
        this.precoBalcao = precoBalcao;
    }

    public Double getPrecoAtacado() {
        return precoAtacado;
    }

    public void setPrecoAtacado(Double precoAtacado) {
        this.precoAtacado = precoAtacado;
    }

    public Double getQuantidadeEstoque() {
        return quantidadeEstoque;
    }

    public void setQuantidadeEstoque(Double quantidadeEstoque) {
        this.quantidadeEstoque = quantidadeEstoque;
    }
}