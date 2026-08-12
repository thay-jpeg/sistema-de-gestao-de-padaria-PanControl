package com.padaria.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario_PK;

    private String nomeUsuario;

    // Getters e Setters

    public Long getIdUsuario_PK() {
        return idUsuario_PK;
    }

    public void setIdUsuario_PK(Long idUsuario_PK) {
        this.idUsuario_PK = idUsuario_PK;
    }

    public String getNomeUsuario() {
        return nomeUsuario;
    }

    public void setNomeUsuario(String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
    }
}