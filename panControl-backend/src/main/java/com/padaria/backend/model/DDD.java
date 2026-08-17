package com.padaria.backend.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity @Table(name = "\"DDD\"")
public class DDD {
    @Id @Column(name = "\"DDD_PK\"") private Integer idDdd;
    public Integer getIdDdd() { return idDdd; } public void setIdDdd(Integer idDdd) { this.idDdd = idDdd; }
}