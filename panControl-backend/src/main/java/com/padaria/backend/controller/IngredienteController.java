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

import com.padaria.backend.model.Ingrediente;
import com.padaria.backend.repository.IngredienteRepository;

@RestController
@RequestMapping("/api/ingredientes")
public class IngredienteController {

    @Autowired
    private IngredienteRepository ingredienteRepository;

    @PostMapping
    public ResponseEntity<Ingrediente> criarIngrediente(@RequestBody Ingrediente novoIngrediente) {
        Ingrediente ingredienteSalvo = ingredienteRepository.save(novoIngrediente);
        return new ResponseEntity<>(ingredienteSalvo, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Ingrediente>> listarIngredientes() {
        return new ResponseEntity<>(ingredienteRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ingrediente> buscarIngredientePorId(@PathVariable Integer id) {
        Optional<Ingrediente> ingrediente = ingredienteRepository.findById(id);
        return ingrediente.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                          .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ingrediente> atualizarIngrediente(@PathVariable Integer id, @RequestBody Ingrediente ingredienteAtualizado) {
        Optional<Ingrediente> ingredienteExistente = ingredienteRepository.findById(id);
        
        if (ingredienteExistente.isPresent()) {
            Ingrediente ingrediente = ingredienteExistente.get();
            
            ingrediente.setNomeIngrediente(ingredienteAtualizado.getNomeIngrediente());
            ingrediente.setUnidadeMedida(ingredienteAtualizado.getUnidadeMedida());
            ingrediente.setQuantidadeEstoque(ingredienteAtualizado.getQuantidadeEstoque());
            ingrediente.setEstoqueMinimo(ingredienteAtualizado.getEstoqueMinimo());
            ingrediente.setCustoMedioUnitario(ingredienteAtualizado.getCustoMedioUnitario());
            
            Ingrediente ingredienteSalvo = ingredienteRepository.save(ingrediente);
            return new ResponseEntity<>(ingredienteSalvo, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarIngrediente(@PathVariable Integer id) {
        Optional<Ingrediente> ingredienteExistente = ingredienteRepository.findById(id);
        
        if (ingredienteExistente.isPresent()) {
            ingredienteRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}