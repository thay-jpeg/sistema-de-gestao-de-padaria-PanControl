package com.padaria.backend.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "\"fichasTecnicas\"")
public class FichaTecnica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"idFichaTecnica_PK\"")
    private Integer idFichaTecnica;

    // Relacionamento com Produto 
    @ManyToOne
    @JoinColumn(name = "\"idProduto_FK\"", nullable = false)
    private Produto produto;

    // Relacionamento com Ingrediente
    @ManyToOne
    @JoinColumn(name = "\"idIngrediente_FK\"", nullable = false)
    private Ingrediente ingrediente;

    @Column(name = "\"textoReceita\"")
    private String textoReceita;

    @Column(name = "\"quantidadeNecessaria\"", nullable = false, precision = 10, scale = 3)
    private BigDecimal quantidadeNecessaria;

    public FichaTecnica() {}

    // Getters e Setters
    public Integer getIdFichaTecnica() { return idFichaTecnica; }
    public void setIdFichaTecnica(Integer idFichaTecnica) { this.idFichaTecnica = idFichaTecnica; }

    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { this.produto = produto; }

    public Ingrediente getIngrediente() { return ingrediente; }
    public void setIngrediente(Ingrediente ingrediente) { this.ingrediente = ingrediente; }

    public String getTextoReceita() { return textoReceita; }
    public void setTextoReceita(String textoReceita) { this.textoReceita = textoReceita; }

    public BigDecimal getQuantidadeNecessaria() { return quantidadeNecessaria; }
    public void setQuantidadeNecessaria(BigDecimal quantidadeNecessaria) { this.quantidadeNecessaria = quantidadeNecessaria; }
}