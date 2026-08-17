package com.padaria.backend.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity @Table(name = "\"dominioEmail\"")
public class DominioEmail {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(name = "\"idDominioEmail_PK\"") private Integer idDominioEmail;
    @Column(name = "dominio") private String dominio;
    // Getters e Setters...
    public Integer getIdDominioEmail() { return idDominioEmail; } public void setIdDominioEmail(Integer idDominioEmail) { this.idDominioEmail = idDominioEmail; }
    public String getDominio() { return dominio; } public void setDominio(String dominio) { this.dominio = dominio; }
}