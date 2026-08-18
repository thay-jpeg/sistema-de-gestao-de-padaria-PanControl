package com.padaria.backend.dto;

public class UsuarioRequestDTO {
    private String nomeUsuario;
    private String codigoAcesso;
    private String senhaHash;
    private String perfil;
    private Boolean statusAtivo;

    public String getNomeUsuario() { return nomeUsuario; } public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }
    public String getCodigoAcesso() { return codigoAcesso; } public void setCodigoAcesso(String codigoAcesso) { this.codigoAcesso = codigoAcesso; }
    public String getSenhaHash() { return senhaHash; } public void setSenhaHash(String senhaHash) { this.senhaHash = senhaHash; }
    public String getPerfil() { return perfil; } public void setPerfil(String perfil) { this.perfil = perfil; }
    public Boolean getStatusAtivo() { return statusAtivo; } public void setStatusAtivo(Boolean statusAtivo) { this.statusAtivo = statusAtivo; }
}