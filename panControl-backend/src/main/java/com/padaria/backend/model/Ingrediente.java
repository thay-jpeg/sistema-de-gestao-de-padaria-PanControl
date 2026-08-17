package com.padaria.backend.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ingredientes")
public class Ingrediente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"idIngrediente_PK\"")
    private Integer idIngrediente;

    @Column(name = "\"nomeIngrediente\"", nullable = false)
    private String nomeIngrediente;

    @Column(name = "\"unidadeMedida\"", nullable = false)
    private String unidadeMedida;

    @Column(name = "\"quantidadeEstoque\"", nullable = false, precision = 10, scale = 3)
    private BigDecimal quantidadeEstoque;

    @Column(name = "\"estoqueMinimo\"", nullable = false, precision = 10, scale = 3)
    private BigDecimal estoqueMinimo;

    @Column(name = "\"custoMedioUnitario\"", nullable = false, precision = 10, scale = 2)
    private BigDecimal custoMedioUnitario;

    public Ingrediente() {}

    // Getters e Setters
    public Integer getIdIngrediente() { return idIngrediente; }
    public void setIdIngrediente(Integer idIngrediente) { this.idIngrediente = idIngrediente; }

    public String getNomeIngrediente() { return nomeIngrediente; }
    public void setNomeIngrediente(String nomeIngrediente) { this.nomeIngrediente = nomeIngrediente; }

    public String getUnidadeMedida() { return unidadeMedida; }
    public void setUnidadeMedida(String unidadeMedida) { this.unidadeMedida = unidadeMedida; }

    public BigDecimal getQuantidadeEstoque() { return quantidadeEstoque; }
    public void setQuantidadeEstoque(BigDecimal quantidadeEstoque) { this.quantidadeEstoque = quantidadeEstoque; }

    public BigDecimal getEstoqueMinimo() { return estoqueMinimo; }
    public void setEstoqueMinimo(BigDecimal estoqueMinimo) { this.estoqueMinimo = estoqueMinimo; }

    public BigDecimal getCustoMedioUnitario() { return custoMedioUnitario; }
    public void setCustoMedioUnitario(BigDecimal custoMedioUnitario) { this.custoMedioUnitario = custoMedioUnitario; }
}