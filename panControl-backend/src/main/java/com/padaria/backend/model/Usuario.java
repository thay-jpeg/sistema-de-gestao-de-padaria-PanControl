package com.padaria.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"idUsuario_PK\"")
    private Integer idUsuario;

    @Column(name = "\"nomeUsuario\"", nullable = false)
    private String nomeUsuario;

    @Column(name = "\"codigoAcesso\"", nullable = false, unique = true)
    private String codigoAcesso;

    @Column(name = "\"senhaHash\"", nullable = false)
    private String senhaHash;

    @Column(name = "\"perfil\"", nullable = false)
    private String perfil;

    @Column(name = "\"statusAtivo\"", nullable = false)
    private Boolean statusAtivo = true;

    // Construtor
    public Usuario() {}

    // Getters e Setters
    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this. idUsuario = idUsuario; }

    public String getNomeUsuario() { return nomeUsuario; }
    public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }

    public String getCodigoAcesso() { return codigoAcesso; }
    public void setCodigoAcesso(String codigoAcesso) { this.codigoAcesso = codigoAcesso; }

    public String getSenhaHash() { return senhaHash; }
    public void setSenhaHash(String senhaHash) { this.senhaHash = senhaHash; }

    public String getPerfil() { return perfil; }
    public void setPerfil(String perfil) { this.perfil = perfil; }

    public Boolean getStatusAtivo() { return statusAtivo; }
    public void setStatusAtivo(Boolean statusAtivo) { this.statusAtivo = statusAtivo; }
}