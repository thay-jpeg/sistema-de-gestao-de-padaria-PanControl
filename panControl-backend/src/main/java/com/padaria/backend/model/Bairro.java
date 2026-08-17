package com.padaria.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "bairro")
public class Bairro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"idBairro_PK\"")
    private Integer idBairro;

    @Column(name = "\"nomeBairro\"", nullable = false)
    private String nomeBairro;

    public Bairro() {}

    public Integer getIdBairro() { return idBairro; }
    public void setIdBairro(Integer idBairro) { this.idBairro = idBairro; }

    public String getNomeBairro() { return nomeBairro; }
    public void setNomeBairro(String nomeBairro) { this.nomeBairro = nomeBairro; }
}