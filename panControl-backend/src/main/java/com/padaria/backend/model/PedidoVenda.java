package com.padaria.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pedidosVenda")
public class PedidoVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPedidoVenda_PK;

    private String situacao;

    private Double valorTotal;

    private LocalDateTime dataPedido;

    // Getters e Setters

    public Long getIdPedidoVenda_PK() {
        return idPedidoVenda_PK;
    }

    public void setIdPedidoVenda_PK(Long idPedidoVenda_PK) {
        this.idPedidoVenda_PK = idPedidoVenda_PK;
    }

    public String getSituacao() {
        return situacao;
    }

    public void setSituacao(String situacao) {
        this.situacao = situacao;
    }

    public Double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(Double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public LocalDateTime getDataPedido() {
        return dataPedido;
    }

    public void setDataPedido(LocalDateTime dataPedido) {
        this.dataPedido = dataPedido;
    }
}