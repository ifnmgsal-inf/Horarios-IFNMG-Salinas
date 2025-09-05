package com.ifnmg.horarios.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ifnmg.horarios.model.Periodo;

@Service
public class PeriodosService {

    private final SheetsService sheetsService;

    public PeriodosService(SheetsService sheetsService) {
        this.sheetsService = sheetsService;
    }

    public List<Periodo> getPeriodos() throws IOException {
        List<List<Object>> values = sheetsService.getSheetValuesLogin("Períodos!A1:B");
        List<Periodo> periodos = new ArrayList<>();
        
        for (List<Object> row : values) {
            String nomePeriodo = row.size() > 0 ? row.get(0).toString().trim() : "";
            String sheetId = row.size() > 1 ? row.get(1).toString().trim() : "";

            if (!nomePeriodo.isEmpty() && !sheetId.isEmpty()) {
                periodos.add(new Periodo(nomePeriodo, sheetId));
            }
        }
        return periodos;
    }

    public Periodo getPeriodoAtual() throws IOException {
        List<Periodo> periodos = getPeriodos();
        if (!periodos.isEmpty()) {
            return periodos.get(periodos.size() - 1);
        }
        return null;
    }
}