package com.padaria.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "\"unidadeFederativa\"")
public class UnidadeFederativa {

    @Id
    @Column(name = "\"siglaUF_PK\"", length = 2)
    private String siglaUF;

    @Column(name = "\"nomeUF\"", nullable = false)
    private String nomeUF;

    public UnidadeFederativa() {}

    public String getSiglaUF() { return siglaUF; }
    public void setSiglaUF(String siglaUF) { this.siglaUF = siglaUF; }

    public String getNomeUF() { return nomeUF; }
    public void setNomeUF(String nomeUF) { this.nomeUF = nomeUF; }
}