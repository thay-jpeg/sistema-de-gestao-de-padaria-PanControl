package com.padaria.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "cidade")
public class Cidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"idCidade_PK\"")
    private Integer idCidade;

    @Column(name = "\"nomeCidade\"", nullable = false)
    private String nomeCidade;

    @ManyToOne
    @JoinColumn(name = "\"siglaUF_FK\"")
    private UnidadeFederativa uf;

    public Cidade() {}

    public Integer getIdCidade() { return idCidade; }
    public void setIdCidade(Integer idCidade) { this.idCidade = idCidade; }

    public String getNomeCidade() { return nomeCidade; }
    public void setNomeCidade(String nomeCidade) { this.nomeCidade = nomeCidade; }

    public UnidadeFederativa getUf() { return uf; }
    public void setUf(UnidadeFederativa uf) { this.uf = uf; }
}