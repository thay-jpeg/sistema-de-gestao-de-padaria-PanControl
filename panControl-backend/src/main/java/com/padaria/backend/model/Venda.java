package com.padaria.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vendas")
public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"idVenda_PK\"")
    private Long idVendaPK;

    @Column(name = "\"valorTotal\"", nullable = false)
    private Double valorTotal;

    @Column(name = "\"metodoPagamento\"", nullable = false)
    private String metodoPagamento;

    @Column(name = "\"dataVenda\"", nullable = false)
    private LocalDateTime dataVenda;

    @ManyToOne
    @JoinColumn(name = "\"idUsuario_FK\"", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "\"idClienteAtacadista_FK\"")
    private ClienteAtacadista clienteAtacadista;

    @ManyToOne
    @JoinColumn(name = "\"idPedidoVenda_FK\"")
    private PedidoVenda pedidoVenda;

    @PrePersist
    protected void onCreate() {
        this.dataVenda = LocalDateTime.now();
    }

    // --- Getters e Setters ---
    public Long getIdVendaPK() { return idVendaPK; }
    public void setIdVendaPK(Long idVendaPK) { this.idVendaPK = idVendaPK; }

    public Double getValorTotal() { return valorTotal; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }

    public String getMetodoPagamento() { return metodoPagamento; }
    public void setMetodoPagamento(String metodoPagamento) { this.metodoPagamento = metodoPagamento; }

    public LocalDateTime getDataVenda() { return dataVenda; }
    public void setDataVenda(LocalDateTime dataVenda) { this.dataVenda = dataVenda; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public ClienteAtacadista getClienteAtacadista() { return clienteAtacadista; }
    public void setClienteAtacadista(ClienteAtacadista clienteAtacadista) { this.clienteAtacadista = clienteAtacadista; }

    public PedidoVenda getPedidoVenda() { return pedidoVenda; }
    public void setPedidoVenda(PedidoVenda pedidoVenda) { this.pedidoVenda = pedidoVenda; }
}