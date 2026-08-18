package com.padaria.backend.dto;

import java.time.LocalDate;

public class ClienteResponseDTO {
    private Integer idClienteAtacadista;
    private String nomeRazaoSocial;
    private String tipoPessoa;
    private String documentoCliente;
    private LocalDate dataNascimento;
    private Boolean ativo;

    public Integer getIdClienteAtacadista() { return idClienteAtacadista; } public void setIdClienteAtacadista(Integer idClienteAtacadista) { this.idClienteAtacadista = idClienteAtacadista; }
    public String getNomeRazaoSocial() { return nomeRazaoSocial; } public void setNomeRazaoSocial(String nomeRazaoSocial) { this.nomeRazaoSocial = nomeRazaoSocial; }
    public String getTipoPessoa() { return tipoPessoa; } public void setTipoPessoa(String tipoPessoa) { this.tipoPessoa = tipoPessoa; }
    public String getDocumentoCliente() { return documentoCliente; } public void setDocumentoCliente(String documentoCliente) { this.documentoCliente = documentoCliente; }
    public LocalDate getDataNascimento() { return dataNascimento; } public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }
    public Boolean getAtivo() { return ativo; } public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}