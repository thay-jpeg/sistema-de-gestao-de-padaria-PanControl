package com.padaria.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "\"tipoLogradouro\"")
public class TipoLogradouro {

    @Id
    @Column(name = "\"siglaTipoLogradouro_PK\"", length = 10)
    private String siglaTipoLogradouro;

    @Column(name = "\"nomeTipoLogradouro\"", nullable = false)
    private String nomeTipoLogradouro;

    public TipoLogradouro() {}

    public String getSiglaTipoLogradouro() { return siglaTipoLogradouro; }
    public void setSiglaTipoLogradouro(String siglaTipoLogradouro) { this.siglaTipoLogradouro = siglaTipoLogradouro; }

    public String getNomeTipoLogradouro() { return nomeTipoLogradouro; }
    public void setNomeTipoLogradouro(String nomeTipoLogradouro) { this.nomeTipoLogradouro = nomeTipoLogradouro; }
}