package com.padaria.backend.model;

import java.math.BigDecimal;
import java.time.LocalDate;
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
@Table(name = "\"comprasIngredientes\"")
public class CompraIngrediente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"idCompras_PK\"")
    private Integer idCompras;

    @Column(name = "\"quantidadeComprada\"", nullable = false)
    private BigDecimal quantidadeComprada;

    @Column(name = "\"dataValidade\"", nullable = false)
    private LocalDate dataValidade;

    @Column(name = "\"quantidadeRestante\"", nullable = false)
    private BigDecimal quantidadeRestante;

    @Column(name = "\"custoTotal\"", nullable = false)
    private BigDecimal custoTotal;

    @Column(name = "\"dataCompra\"", nullable = false)
    private LocalDateTime dataCompra;

    @ManyToOne
    @JoinColumn(name = "\"idUsuario_FK\"", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "\"idIngrediente_FK\"", nullable = false)
    private Ingrediente ingrediente;

    public CompraIngrediente() {}

    public Integer getIdCompras() { return idCompras; } public void setIdCompras(Integer idCompras) { this.idCompras = idCompras; }
    public BigDecimal getQuantidadeComprada() { return quantidadeComprada; } public void setQuantidadeComprada(BigDecimal quantidadeComprada) { this.quantidadeComprada = quantidadeComprada; }
    public LocalDate getDataValidade() { return dataValidade; } public void setDataValidade(LocalDate dataValidade) { this.dataValidade = dataValidade; }
    public BigDecimal getQuantidadeRestante() { return quantidadeRestante; } public void setQuantidadeRestante(BigDecimal quantidadeRestante) { this.quantidadeRestante = quantidadeRestante; }
    public BigDecimal getCustoTotal() { return custoTotal; } public void setCustoTotal(BigDecimal custoTotal) { this.custoTotal = custoTotal; }
    public LocalDateTime getDataCompra() { return dataCompra; } public void setDataCompra(LocalDateTime dataCompra) { this.dataCompra = dataCompra; }
    public Usuario getUsuario() { return usuario; } public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public Ingrediente getIngrediente() { return ingrediente; } public void setIngrediente(Ingrediente ingrediente) { this.ingrediente = ingrediente; }
}