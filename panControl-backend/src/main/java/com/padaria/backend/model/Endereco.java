package com.padaria.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "endereco")
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"idEndereco_PK\"")
    private Integer idEndereco;

    @Column(name = "\"CEP\"", nullable = false)
    private String cep;

    @Column(name = "\"complementoEnd\"")
    private String complementoEnd;

    @Column(name = "\"numeroEnd\"", nullable = false)
    private String numeroEnd;

    // As chaves estrangeiras
    @ManyToOne
    @JoinColumn(name = "\"idClienteAtacadista_FK\"")
    private ClienteAtacadista cliente;

    @ManyToOne
    @JoinColumn(name = "\"idCidade_FK\"")
    private Cidade cidade;

    @ManyToOne
    @JoinColumn(name = "\"idLogradouro_FK\"")
    private Logradouro logradouro;

    @ManyToOne
    @JoinColumn(name = "\"idBairro_FK\"")
    private Bairro bairro;

    public Endereco() {}

    public Integer getIdEndereco() { return idEndereco; }
    public void setIdEndereco(Integer idEndereco) { this.idEndereco = idEndereco; }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }

    public String getComplementoEnd() { return complementoEnd; }
    public void setComplementoEnd(String complementoEnd) { this.complementoEnd = complementoEnd; }

    public String getNumeroEnd() { return numeroEnd; }
    public void setNumeroEnd(String numeroEnd) { this.numeroEnd = numeroEnd; }

    public ClienteAtacadista getCliente() { return cliente; }
    public void setCliente(ClienteAtacadista cliente) { this.cliente = cliente; }

    public Cidade getCidade() { return cidade; }
    public void setCidade(Cidade cidade) { this.cidade = cidade; }

    public Logradouro getLogradouro() { return logradouro; }
    public void setLogradouro(Logradouro logradouro) { this.logradouro = logradouro; }

    public Bairro getBairro() { return bairro; }
    public void setBairro(Bairro bairro) { this.bairro = bairro; }
}