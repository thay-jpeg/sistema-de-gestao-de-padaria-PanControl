package com.padaria.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.padaria.backend.model.DominioEmail;

@Repository
public interface DominioEmailRepository extends JpaRepository<DominioEmail, Integer> {
    DominioEmail findByDominio(String dominio);
}
