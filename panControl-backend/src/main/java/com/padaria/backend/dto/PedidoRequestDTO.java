package com.padaria.backend.dto;

import java.util.List;

public class PedidoRequestDTO {
    private Integer idUsuario;
    private Integer idClienteAtacadista;
    private List<ItemVendaDTO> itens;
    private String situacao;

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Integer getIdClienteAtacadista() {
        return idClienteAtacadista;
    }

    public void setIdClienteAtacadista(Integer idClienteAtacadista) {
        this.idClienteAtacadista = idClienteAtacadista;
    }

    public List<ItemVendaDTO> getItens() {
        return itens;
    }

    public void setItens(List<ItemVendaDTO> itens) {
        this.itens = itens;
    }

    public String getSituacao() {
        return situacao;
    }

    public void setSituacao(String situacao) {
        this.situacao = situacao;
    }
}