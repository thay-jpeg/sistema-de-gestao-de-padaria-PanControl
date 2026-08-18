package com.padaria.backend.service;

import com.padaria.backend.dto.UsuarioRequestDTO;
import com.padaria.backend.dto.UsuarioResponseDTO;
import com.padaria.backend.model.Usuario;
import com.padaria.backend.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO dto) {
        Usuario usuario = new Usuario();
        mapearDtoParaEntidade(dto, usuario);
        
        if (usuario.getStatusAtivo() == null) {
            usuario.setStatusAtivo(true);
        }
        Usuario salvo = usuarioRepository.save(usuario);
        return mapearEntidadeParaDto(salvo);
    }

    public List<UsuarioResponseDTO> listarUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::mapearEntidadeParaDto)
                .collect(Collectors.toList());
    }

    public UsuarioResponseDTO buscarUsuarioPorId(Integer id) {
        return usuarioRepository.findById(id)
                .map(this::mapearEntidadeParaDto)
                .orElse(null);
    }

    @Transactional
    public UsuarioResponseDTO atualizarUsuario(Integer id, UsuarioRequestDTO dto) {
        Usuario usuarioExistente = usuarioRepository.findById(id).orElse(null);
        if (usuarioExistente == null) return null;

        mapearDtoParaEntidade(dto, usuarioExistente);
        if (dto.getStatusAtivo() != null) {
            usuarioExistente.setStatusAtivo(dto.getStatusAtivo());
        }

        Usuario atualizado = usuarioRepository.save(usuarioExistente);
        return mapearEntidadeParaDto(atualizado);
    }

    @Transactional
    public boolean deletarUsuario(Integer id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private void mapearDtoParaEntidade(UsuarioRequestDTO dto, Usuario entidade) {
        entidade.setNomeUsuario(dto.getNomeUsuario());
        entidade.setCodigoAcesso(dto.getCodigoAcesso());
        entidade.setSenhaHash(dto.getSenhaHash());
        entidade.setPerfil(dto.getPerfil());
        entidade.setStatusAtivo(dto.getStatusAtivo());
    }

    private UsuarioResponseDTO mapearEntidadeParaDto(Usuario entidade) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setIdUsuario(entidade.getIdUsuario());
        dto.setNomeUsuario(entidade.getNomeUsuario());
        dto.setCodigoAcesso(entidade.getCodigoAcesso());
        dto.setPerfil(entidade.getPerfil());
        dto.setStatusAtivo(entidade.getStatusAtivo());
        return dto;
    }
}