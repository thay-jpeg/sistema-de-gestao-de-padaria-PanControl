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
@Table(name = "producoes")
public class Producao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"idProducao_PK\"")
    private Integer idProducao;

    @ManyToOne
    @JoinColumn(name = "\"idProduto_FK\"", nullable = false)
    private Produto produto;

    @ManyToOne
    @JoinColumn(name = "\"idUsuario_FK\"", nullable = false)
    private Usuario usuario;

    @Column(name = "\"dataProducao\"", nullable = false)
    private LocalDateTime dataProducao;

    @Column(name = "\"quantidadeProduzida\"", nullable = false)
    private Integer quantidadeProduzida;

    @Column(name = "\"custoTotalProducao\"", nullable = false)
    private BigDecimal custoTotalProducao;

    @Column(name = "\"dataValidadeLote\"", nullable = false)
    private LocalDate dataValidade;
    
    public Producao() {}

    // Getters e Setters
    public Integer getIdProducao() { return idProducao; }
    public void setIdProducao(Integer idProducao) { this.idProducao = idProducao; }

    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { this.produto = produto; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public LocalDateTime getDataProducao() { return dataProducao; }
    public void setDataProducao(LocalDateTime dataProducao) { this.dataProducao = dataProducao; }

    public Integer getQuantidadeProduzida() { return quantidadeProduzida; }
    public void setQuantidadeProduzida(Integer quantidadeProduzida) { this.quantidadeProduzida = quantidadeProduzida; }

    public BigDecimal getCustoTotalProducao() { return custoTotalProducao; }
    public void setCustoTotalProducao(BigDecimal custoTotalProducao) { this.custoTotalProducao = custoTotalProducao; }

    public LocalDate getDataValidade() { return dataValidade; }
    public void setDataValidade(LocalDate dataValidade) { this.dataValidade = dataValidade; }
}