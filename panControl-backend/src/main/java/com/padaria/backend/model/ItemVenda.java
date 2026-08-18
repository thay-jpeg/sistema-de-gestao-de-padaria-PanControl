package com.padaria.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "\"itensVenda\"")
public class ItemVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"idItensVenda_PK\"")
    private Long idItensVendaPK;

    @Column(name = "\"quantidade\"", nullable = false)
    private Integer quantidade;

    @Column(name = "\"precoUnitarioAplicado\"", nullable = false)
    private Double precoUnitarioAplicado;

    @ManyToOne
    @JoinColumn(name = "\"idProduto_FK\"", nullable = false)
    private Produto produto;

    @ManyToOne
    @JoinColumn(name = "\"idVenda_FK\"", nullable = false)
    private Venda venda;

    public Long getIdItensVenda() {
        return idItensVendaPK;
    }

    public void setIdItensVenda(Long idItensVendaPK) {
        this.idItensVendaPK = idItensVendaPK;
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

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }

    public Venda getVenda() {
        return venda;
    }

    public void setVenda(Venda venda) {
        this.venda = venda;
    }
}