package com.padaria.backend.controller;

import com.padaria.backend.model.Usuario;
import com.padaria.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // POST para criar um novo usuário
    @PostMapping
    public ResponseEntity<Usuario> criarUsuario(@RequestBody Usuario novoUsuario) {
        // Como statusAtivo já tem default, garantimos que seja salvo corretamente
        if(novoUsuario.getStatusAtivo() == null) {
            novoUsuario.setStatusAtivo(true);
        }
        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);
        return new ResponseEntity<>(usuarioSalvo, HttpStatus.CREATED);
    }

    // GET para listar os usuários
    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return new ResponseEntity<>(usuarioRepository.findAll(), HttpStatus.OK);
    }

    // GET para listar um usuario específico pelo ID
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarUsuarioPorId(@PathVariable Integer id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);

        if (usuario.isPresent()) {
            return new ResponseEntity<>(usuario.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 se não achar
    }

    // PUT para atualizar um usuario existente
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable Integer id, @RequestBody Usuario usuarioAtualizado) {
        Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);

        if (usuarioExistente.isPresent()) {
            Usuario usuario = usuarioExistente.get();

            usuario.setNomeUsuario(usuarioAtualizado.getNomeUsuario());
            usuario.setCodigoAcesso(usuarioAtualizado.getCodigoAcesso());
            usuario.setSenhaHash(usuarioAtualizado.getSenhaHash());
            usuario.setPerfil(usuarioAtualizado.getPerfil());

            if (usuarioAtualizado.getStatusAtivo() != null) {
                usuario.setStatusAtivo(usuarioAtualizado.getStatusAtivo());
            }

            Usuario usuarioSalvo = usuarioRepository.save(usuario);
            return new ResponseEntity<>(usuarioSalvo, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // DELETE para deletar um usuario existente
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Integer id) {
        Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);

        if (usuarioExistente.isPresent()) {
            usuarioRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 indica sucesso sem retornar corpo
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}