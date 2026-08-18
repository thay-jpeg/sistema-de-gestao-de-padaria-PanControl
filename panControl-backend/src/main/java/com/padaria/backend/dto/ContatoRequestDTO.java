package com.padaria.backend.dto;

public class ContatoRequestDTO {
    private Integer idCliente;
    private String contatoCompleto; // Usaremos o mesmo DTO para E-mail e Telefone

    public ContatoRequestDTO() {}

    public Integer getIdCliente() { return idCliente; }
    public void setIdCliente(Integer idCliente) { this.idCliente = idCliente; }
    public String getContatoCompleto() { return contatoCompleto; }
    public void setContatoCompleto(String contatoCompleto) { this.contatoCompleto = contatoCompleto; }
}