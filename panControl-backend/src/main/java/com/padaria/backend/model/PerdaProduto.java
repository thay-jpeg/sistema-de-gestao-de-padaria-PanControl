package com.padaria.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "\"perdasProduto\"")
public class PerdaProduto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"idPerdaProduto_PK\"")
    private Integer idPerdaProduto;

    @ManyToOne
    @JoinColumn(name = "\"idProduto_FK\"", nullable = false)
    private Produto produto;

    @ManyToOne
    @JoinColumn(name = "\"idUsuario_FK\"", nullable = false)
    private Usuario usuario;

    @Column(name = "\"quantidadePerdida\"", nullable = false)
    private Integer quantidadePerdida;

    @Column(name = "\"motivoPerda\"", nullable = false)
    private String motivoPerda;

    @Column(name = "\"dataPerda\"", nullable = false)
    private LocalDateTime dataPerda;

    public PerdaProduto() {}

    public Integer getIdPerdaProduto() { return idPerdaProduto; }
    public void setIdPerdaProduto(Integer idPerdaProduto) { this.idPerdaProduto = idPerdaProduto; }

    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { this.produto = produto; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Integer getQuantidadePerdida() { return quantidadePerdida; }
    public void setQuantidadePerdida(Integer quantidadePerdida) { this.quantidadePerdida = quantidadePerdida; }

    public String getMotivoPerda() { return motivoPerda; }
    public void setMotivoPerda(String motivoPerda) { this.motivoPerda = motivoPerda; }

    public LocalDateTime getDataPerda() { return dataPerda; }
    public void setDataPerda(LocalDateTime dataPerda) { this.dataPerda = dataPerda; }
}