package com.padaria.backend.repository;
//Isso vai salvar o cabeçalho da venda (total, data, metodo de pagamento).
import com.padaria.backend.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {
}