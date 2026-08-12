package com.padaria.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "itensVenda")
public class ItemVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idItensVenda_PK;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(nullable = false)
    private Double precoUnitarioAplicado;

    @ManyToOne
    @JoinColumn(name = "idProduto_FK", nullable = false)
    private Produto idProduto_FK;

    @ManyToOne
    @JoinColumn(name = "idVenda_FK", nullable = false)
    private Venda idVenda_FK;

    // Getters e Setters

    public Long getIdItensVenda_PK() {
        return idItensVenda_PK;
    }

    public void setIdItensVenda_PK(Long idItensVenda_PK) {
        this.idItensVenda_PK = idItensVenda_PK;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public Double getPrecoUnitarioAplicado() {
        return precoUnitarioAplicado;
    }

    public void setPrecoUnitarioAplicado(Double precoUnitarioAplicado) {
        this.precoUnitarioAplicado = precoUnitarioAplicado;
    }

    public Produto getIdProduto_FK() {
        return idProduto_FK;
    }

    public void setIdProduto_FK(Produto idProduto_FK) {
        this.idProduto_FK = idProduto_FK;
    }

    public Venda getIdVenda_FK() {
        return idVenda_FK;
    }

    public void setIdVenda_FK(Venda idVenda_FK) {
        this.idVenda_FK = idVenda_FK;
    }
}