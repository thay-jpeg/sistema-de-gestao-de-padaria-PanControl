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
@Table(name = "logradouro")
public class Logradouro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"idLogradouro_PK\"")
    private Integer idLogradouro;

    @Column(name = "\"nomeLogradouro\"", nullable = false)
    private String nomeLogradouro;

    @ManyToOne
    @JoinColumn(name = "\"siglaTipoLogradouro_FK\"")
    private TipoLogradouro tipoLogradouro;

    public Logradouro() {}

    public Integer getIdLogradouro() { return idLogradouro; }
    public void setIdLogradouro(Integer idLogradouro) { this.idLogradouro = idLogradouro; }

    public String getNomeLogradouro() { return nomeLogradouro; }
    public void setNomeLogradouro(String nomeLogradouro) { this.nomeLogradouro = nomeLogradouro; }

    public TipoLogradouro getTipoLogradouro() { return tipoLogradouro; }
    public void setTipoLogradouro(TipoLogradouro tipoLogradouro) { this.tipoLogradouro = tipoLogradouro; }
}