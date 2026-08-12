package com.padaria.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "vendas")
public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idVenda_PK;

    @Column(name = "\"valorTotal\"", nullable = false)
    private Double valorTotal;

    @Column(nullable = false)
    private String metodoPagamento;

    @Column(nullable = false)
    private LocalDateTime dataVenda;

    @ManyToOne
    @JoinColumn(name = "idUsuario_FK")
    private Usuario idUsuario_FK;

    @ManyToOne
    @JoinColumn(name = "idClienteAtacadista_FK")
    private ClienteAtacadista idClienteAtacadista_FK;

    @ManyToOne
    @JoinColumn(name = "idPedidoVenda_FK")
    private PedidoVenda idPedidoVenda_FK;

    // Relacionamento inverso: Uma venda tem vários itens
    @OneToMany(mappedBy = "idVenda_FK", cascade = CascadeType.ALL)
    private List<ItemVenda> itensVenda;

    // Getters e Setters
    public Long getIdVenda_PK() {
        return idVenda_PK;
    }

    public void setIdVenda_PK(Long idVenda_PK) {
        this.idVenda_PK = idVenda_PK;
    }

    public Double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(Double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public String getMetodoPagamento() {
        return metodoPagamento;
    }

    public void setMetodoPagamento(String metodoPagamento) {
        this.metodoPagamento = metodoPagamento;
    }

    public LocalDateTime getDataVenda() {
        return dataVenda;
    }

    public void setDataVenda(LocalDateTime dataVenda) {
        this.dataVenda = dataVenda;
    }

    public Usuario getIdUsuario_FK() {
        return idUsuario_FK;
    }

    public void setIdUsuario_FK(Usuario idUsuario_FK) {
        this.idUsuario_FK = idUsuario_FK;
    }

    public ClienteAtacadista getIdClienteAtacadista_FK() {
        return idClienteAtacadista_FK;
    }

    public void setIdClienteAtacadista_FK(ClienteAtacadista idClienteAtacadista_FK) {
        this.idClienteAtacadista_FK = idClienteAtacadista_FK;
    }

    public PedidoVenda getIdPedidoVenda_FK() {
        return idPedidoVenda_FK;
    }

    public void setIdPedidoVenda_FK(PedidoVenda idPedidoVenda_FK) {
        this.idPedidoVenda_FK = idPedidoVenda_FK;
    }

    public List<ItemVenda> getItensVenda() {
        return itensVenda;
    }

    public void setItensVenda(List<ItemVenda> itensVenda) {
        this.itensVenda = itensVenda;
    }
}