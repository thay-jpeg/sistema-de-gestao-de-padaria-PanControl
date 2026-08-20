package com.padaria.backend.repository;

import com.padaria.backend.model.Ingrediente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngredienteRepository extends JpaRepository<Ingrediente, Integer> {

    @Query(value = "SELECT i.\"idIngrediente_PK\" AS idIngrediente, " +
            "i.\"nomeIngrediente\" AS nome, " +
            "i.\"unidadeMedida\" AS medida, " +
            "i.\"custoMedioUnitario\" AS custo, " +
            "i.\"quantidadeEstoque\" AS estoque, " +
            "i.\"estoqueMinimo\" AS minimo, " +
            "MAX(c.\"dataValidade\") AS validade " +
            "FROM ingredientes i " +
            "LEFT JOIN \"comprasIngredientes\" c ON i.\"idIngrediente_PK\" = c.\"idIngrediente_FK\" " +
            "WHERE (:dataInicio IS NULL OR c.\"dataCompra\" >= CAST(:dataInicio AS date)) " +
            "AND (:dataFim IS NULL OR c.\"dataCompra\" <= CAST(:dataFim AS date)) " +
            "GROUP BY i.\"idIngrediente_PK\"",
            nativeQuery = true)
    List<RelatorioIngredienteProjection> buscarRelatorioComFiltro(
            @Param("dataInicio") String dataInicio,
            @Param("dataFim") String dataFim);
}