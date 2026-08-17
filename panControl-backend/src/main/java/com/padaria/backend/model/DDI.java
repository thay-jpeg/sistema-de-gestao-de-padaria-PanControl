package com.padaria.backend.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity @Table(name = "\"DDI\"")
public class DDI {
    @Id @Column(name = "\"DDI_PK\"") private Integer idDdi;
    public Integer getIdDdi() { return idDdi; } public void setIdDdi(Integer idDdi) { this.idDdi = idDdi; }
}