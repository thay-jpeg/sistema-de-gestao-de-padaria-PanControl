package com.padaria.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity @Table(name = "\"foneCliente\"")
public class FoneCliente {
    @Id @Column(name = "\"nroTelefone_PK\"") private String nroTelefone;
    @ManyToOne @JoinColumn(name = "\"DDD_PK\"") private DDD ddd;
    @ManyToOne @JoinColumn(name = "\"DDI_PK\"") private DDI ddi;
    @ManyToOne @JoinColumn(name = "\"idCliente_FK\"") private ClienteAtacadista cliente;
    
    // Getters e Setters
    public String getNroTelefone() { return nroTelefone; } public void setNroTelefone(String nroTelefone) { this.nroTelefone = nroTelefone; }
    public DDD getDdd() { return ddd; } public void setDdd(DDD ddd) { this.ddd = ddd; }
    public DDI getDdi() { return ddi; } public void setDdi(DDI ddi) { this.ddi = ddi; }
    public ClienteAtacadista getCliente() { return cliente; } public void setCliente(ClienteAtacadista cliente) { this.cliente = cliente; }
}