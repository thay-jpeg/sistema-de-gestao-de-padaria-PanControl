package com.padaria.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "\"pedidosVenda\"")
public class PedidoVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"idPedidoVenda_PK\"")
    private Long idPedidoVendaPK;

    @Column(name = "\"situacao\"", nullable = false)
    private String situacao;

    @Column(name = "\"dataPedido\"", nullable = false)
    private LocalDateTime dataPedido;

    @Column(name = "\"valorTotal\"", nullable = false)
    private Double valorTotal;

    @ManyToOne
    @JoinColumn(name = "\"idClienteAtacadista_FK\"")
    private ClienteAtacadista clienteAtacadista;

    @ManyToOne
    @JoinColumn(name = "\"idUsuario_FK\"", nullable = false)
    private Usuario usuario;

    @PrePersist
    protected void onCreate() {
        this.dataPedido = LocalDateTime.now();
    }

    public Long getIdPedidoVenda() {
        return idPedidoVendaPK;
    }

    public void setIdPedidoVenda(Long idPedidoVendaPK) {
        this.idPedidoVendaPK = idPedidoVendaPK;
    }

    public String getSituacao() {
        return situacao;
    }

    public void setSituacao(String situacao) {
        this.situacao = situacao;
    }

    public LocalDateTime getDataPedido() {
        return dataPedido;
    }

    public void setDataPedido(LocalDateTime dataPedido) {
        this.dataPedido = dataPedido;
    }

    public Double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(Double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public ClienteAtacadista getClienteAtacadista() {
        return clienteAtacadista;
    }

    public void setClienteAtacadista(ClienteAtacadista clienteAtacadista) {
        this.clienteAtacadista = clienteAtacadista;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}