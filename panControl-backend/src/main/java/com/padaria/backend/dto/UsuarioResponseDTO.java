package com.padaria.backend.dto;

public class UsuarioResponseDTO {
    private Integer idUsuario;
    private String nomeUsuario;
    private String codigoAcesso;
    private String perfil;
    private Boolean statusAtivo;

    public Integer getIdUsuario() { return idUsuario; } public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
    public String getNomeUsuario() { return nomeUsuario; } public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }
    public String getCodigoAcesso() { return codigoAcesso; } public void setCodigoAcesso(String codigoAcesso) { this.codigoAcesso = codigoAcesso; }
    public String getPerfil() { return perfil; } public void setPerfil(String perfil) { this.perfil = perfil; }
    public Boolean getStatusAtivo() { return statusAtivo; } public void setStatusAtivo(Boolean statusAtivo) { this.statusAtivo = statusAtivo; }
}