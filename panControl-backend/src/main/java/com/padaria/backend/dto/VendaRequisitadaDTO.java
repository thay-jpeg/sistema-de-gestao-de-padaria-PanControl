package com.padaria.backend.dto;
import java.util.List;

public class VendaRequisitadaDTO {
    private String metodoPagamento;
    private Integer idUsuario;
    private Integer idClienteAtacadista;
    private List<ItemVendaDTO> itens;

    public String getMetodoPagamento() { return metodoPagamento; }
    public void setMetodoPagamento(String metodoPagamento) { this.metodoPagamento = metodoPagamento; }
    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
    public Integer getIdClienteAtacadista() { return idClienteAtacadista; }
    public void setIdClienteAtacadista(Integer idClienteAtacadista) { this.idClienteAtacadista = idClienteAtacadista; }
    public List<ItemVendaDTO> getItens() { return itens; }
    public void setItens(List<ItemVendaDTO> itens) { this.itens = itens; }
}