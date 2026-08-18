package com.padaria.backend.dto;
import java.util.List;

public class VendaRequestDTO {
    private String metodoPagamento;
    private Integer idUsuario;
    private Integer idClienteAtacadista;
    private List<ItemVendaRequestDTO> itens;

    public String getMetodoPagamento() { return metodoPagamento; }
    public void setMetodoPagamento(String metodoPagamento) { this.metodoPagamento = metodoPagamento; }
    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
    public Integer getIdClienteAtacadista() { return idClienteAtacadista; }
    public void setIdClienteAtacadista(Integer idClienteAtacadista) { this.idClienteAtacadista = idClienteAtacadista; }
    public List<ItemVendaRequestDTO> getItens() { return itens; }
    public void setItens(List<ItemVendaRequestDTO> itens) { this.itens = itens; }
}