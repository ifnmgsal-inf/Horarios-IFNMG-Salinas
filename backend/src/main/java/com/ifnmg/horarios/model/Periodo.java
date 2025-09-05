package com.ifnmg.horarios.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Periodo {
    // Nome do período e o identificador da planilha
    private String nomePeriodo;
    private String sheetId;
}