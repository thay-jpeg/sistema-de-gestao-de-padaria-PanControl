package com.padaria.backend.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "\"clientesAtacadistas\"")
public class ClienteAtacadista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"idClienteAtacadista_PK\"")
    private Integer idClienteAtacadista;

    @Column(name = "\"nomeRazaoSocial\"", nullable = false)
    private String nomeRazaoSocial;

    @Column(name = "\"tipoPessoa\"", nullable = false, length = 1)
    private String tipoPessoa;

    @Column(name = "\"documentoCliente\"", nullable = false, unique = true)
    private String documentoCliente;

    @Column(name = "\"dataNascimento\"")
    private LocalDate dataNascimento;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

    public ClienteAtacadista() {}

    // Getters e Setters
    public Integer getIdClienteAtacadista() { return idClienteAtacadista; }
    public void setIdClienteAtacadista(Integer idClienteAtacadista) { this.idClienteAtacadista = idClienteAtacadista; }

    public String getNomeRazaoSocial() { return nomeRazaoSocial; }
    public void setNomeRazaoSocial(String nomeRazaoSocial) { this.nomeRazaoSocial = nomeRazaoSocial; }

    public String getTipoPessoa() { return tipoPessoa; }
    public void setTipoPessoa(String tipoPessoa) { this.tipoPessoa = tipoPessoa; }

    public String getDocumentoCliente() { return documentoCliente; }
    public void setDocumentoCliente(String documentoCliente) { this.documentoCliente = documentoCliente; }

    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}