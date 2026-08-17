package com.padaria.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.padaria.backend.model.FichaTecnica;
import com.padaria.backend.repository.FichaTecnicaRepository;

@RestController
@RequestMapping("/api/fichastecnicas")
public class FichaTecnicaController {

    @Autowired
    private FichaTecnicaRepository fichaTecnicaRepository;

    @PostMapping
    public ResponseEntity<FichaTecnica> criarFichaTecnica(@RequestBody FichaTecnica novaFicha) {
        FichaTecnica fichaSalva = fichaTecnicaRepository.save(novaFicha);
        return new ResponseEntity<>(fichaSalva, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FichaTecnica>> listarFichasTecnicas() {
        return new ResponseEntity<>(fichaTecnicaRepository.findAll(), HttpStatus.OK);
    }

    // Rota para buscar ficha de um produto
    @GetMapping("/produto/{idProduto}")
    public ResponseEntity<List<FichaTecnica>> listarFichasPorProduto(@PathVariable Integer idProduto) {
        List<FichaTecnica> fichas = fichaTecnicaRepository.findByProdutoIdProduto(idProduto);
        if(fichas.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(fichas, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FichaTecnica> buscarFichaTecnicaPorId(@PathVariable Integer id) {
        Optional<FichaTecnica> ficha = fichaTecnicaRepository.findById(id);
        return ficha.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FichaTecnica> atualizarFichaTecnica(@PathVariable Integer id, @RequestBody FichaTecnica fichaAtualizada) {
        Optional<FichaTecnica> fichaExistente = fichaTecnicaRepository.findById(id);
        
        if (fichaExistente.isPresent()) {
            FichaTecnica ficha = fichaExistente.get();
            
            // Atualiza apenas os campos necessários
            ficha.setTextoReceita(fichaAtualizada.getTextoReceita());
            ficha.setQuantidadeNecessaria(fichaAtualizada.getQuantidadeNecessaria());
            
            FichaTecnica fichaSalva = fichaTecnicaRepository.save(ficha);
            return new ResponseEntity<>(fichaSalva, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarFichaTecnica(@PathVariable Integer id) {
        Optional<FichaTecnica> fichaExistente = fichaTecnicaRepository.findById(id);
        
        if (fichaExistente.isPresent()) {
            fichaTecnicaRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}