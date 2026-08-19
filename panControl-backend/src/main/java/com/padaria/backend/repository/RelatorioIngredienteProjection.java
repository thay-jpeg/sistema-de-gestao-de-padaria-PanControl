package com.padaria.backend.repository;

import java.math.BigDecimal;
import java.util.Date;

public interface
RelatorioIngredienteProjection {
    Integer getIdIngrediente();
    String getNome();
    String getMedida();
    BigDecimal getCusto();
    BigDecimal getEstoque();
    BigDecimal getMinimo();
    Date getValidade();
}
