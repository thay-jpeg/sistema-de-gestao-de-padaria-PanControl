package com.padaria.backend.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity @Table(name = "\"emailCliente\"")
public class EmailCliente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(name = "\"idEmail_PK\"") private Integer idEmail;
    @Column(name = "credencial") private String credencial;

    @ManyToOne @JoinColumn(name = "\"idDominioEmail_FK\"") private DominioEmail dominio;
    @ManyToOne @JoinColumn(name = "\"idClienteAtacadista_FK\"") private ClienteAtacadista cliente;

    // Getters e Setters
    public Integer getIdEmail() { return idEmail; } public void setIdEmail(Integer idEmail) { this.idEmail = idEmail; }
    public String getCredencial() { return credencial; } public void setCredencial(String credencial) { this.credencial = credencial; }
    public DominioEmail getDominio() { return dominio; } public void setDominio(DominioEmail dominio) { this.dominio = dominio; }
    public ClienteAtacadista getCliente() { return cliente; } public void setCliente(ClienteAtacadista cliente) { this.cliente = cliente; }
}