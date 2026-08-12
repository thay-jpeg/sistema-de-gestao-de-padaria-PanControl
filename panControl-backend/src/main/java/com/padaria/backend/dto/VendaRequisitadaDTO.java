package com.padaria.backend.dto;
//o pacote completo que o front-end vai enviar
import java.util.List;

public class VendaRequisitadaDTO {

    private String metodoPagamento;
    private Long idUsuario;
    private Long idClienteAtacadista;
    private List<ItemVendaDTO> itens;

    // Getters e Setters
    public String getMetodoPagamento() {
        return metodoPagamento;
    }

    public void setMetodoPagamento(String metodoPagamento) {
        this.metodoPagamento = metodoPagamento;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Long getIdClienteAtacadista() {
        return idClienteAtacadista;
    }

    public void setIdClienteAtacadista(Long idClienteAtacadista) {
        this.idClienteAtacadista = idClienteAtacadista;
    }

    public List<ItemVendaDTO> getItens() {
        return itens;
    }

    public void setItens(List<ItemVendaDTO> itens) {
        this.itens = itens;
    }
}