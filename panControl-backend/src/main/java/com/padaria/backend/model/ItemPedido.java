package com.padaria.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "\"itensPedido\"")
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"idItensPedido_PK\"")
    private Long idItemPedido;

    @ManyToOne
    @JoinColumn(name = "\"idPedidoVenda_FK\"")
    @JsonIgnore
    private PedidoVenda pedidoVenda;

    @ManyToOne
    @JoinColumn(name = "\"idProduto_FK\"")
    private Produto produto;

    @Column(name = "quantidade")
    private Integer quantidade;

    @Column(name = "\"precoUnitarioAplicado\"")
    private Double precoUnitarioAplicado;

    public ItemPedido() {
    }

    // Getters e Setters
    public Long getIdItemPedido() { return idItemPedido; }
    public void setIdItemPedido(Long idItemPedido) { this.idItemPedido = idItemPedido; }

    public PedidoVenda getPedidoVenda() { return pedidoVenda; }
    public void setPedidoVenda(PedidoVenda pedidoVenda) { this.pedidoVenda = pedidoVenda; }

    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { this.produto = produto; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    public Double getPrecoUnitarioAplicado() { return precoUnitarioAplicado; }
    public void setPrecoUnitarioAplicado(Double precoUnitarioAplicado) { this.precoUnitarioAplicado = precoUnitarioAplicado; }
}