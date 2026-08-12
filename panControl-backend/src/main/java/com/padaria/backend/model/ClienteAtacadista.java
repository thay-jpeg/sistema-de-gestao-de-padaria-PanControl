package com.padaria.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "clientesAtacadistas")
public class ClienteAtacadista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idClienteAtacadista_PK;

    private String nomeRazaoSocial;
    private String tipoPessoa;
    private Boolean ativo;

    // Getters e Setters

    public Long getIdClienteAtacadista_PK() {
        return idClienteAtacadista_PK;
    }

    public void setIdClienteAtacadista_PK(Long idClienteAtacadista_PK) {
        this.idClienteAtacadista_PK = idClienteAtacadista_PK;
    }

    public String getNomeRazaoSocial() {
        return nomeRazaoSocial;
    }

    public void setNomeRazaoSocial(String nomeRazaoSocial) {
        this.nomeRazaoSocial = nomeRazaoSocial;
    }

    public String getTipoPessoa() {
        return tipoPessoa;
    }

    public void setTipoPessoa(String tipoPessoa) {
        this.tipoPessoa = tipoPessoa;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
}