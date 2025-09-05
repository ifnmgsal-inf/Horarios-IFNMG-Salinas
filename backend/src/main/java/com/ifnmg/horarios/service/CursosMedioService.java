package com.ifnmg.horarios.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ifnmg.horarios.constants.CursosConstants;
import com.ifnmg.horarios.model.Curso;
import com.ifnmg.horarios.model.Horarios;

@Service
public class CursosMedioService {
    
    private final SheetsService sheetsService;

    public CursosMedioService(SheetsService sheetsService) {
        this.sheetsService = sheetsService;
    }

    public ResponseEntity<Horarios> getSheetsValues(String periodoId, String cursoSelecionado) throws IOException {
        
        Curso curso = CursosConstants.CURSOS_MEDIO.getOrDefault(cursoSelecionado, CursosConstants.CURSOS_MEDIO.get("default"));
        
        List<List<Object>> valuesRange1 = sheetsService.getSheetValues(periodoId, CursosConstants.RANGE_HORAS_MEDIO);
        List<List<Object>> valuesRange2 = sheetsService.getSheetValues(periodoId, CursosConstants.getRangeCompletoMedio(curso));

        int columnsRange1 = 1;
        int columnsRange2 = valuesRange2.isEmpty() ? 0 : valuesRange2.get(0).size();

        List<List<Object>> combinedValues = IntStream.range(0, Math.max(valuesRange1.size(), valuesRange2.size()))
                .mapToObj(i -> {
                    List<Object> combinedRow = new ArrayList<>(Collections.nCopies(columnsRange1 + columnsRange2, ""));

                    if (i < valuesRange1.size()) {
                        for (int j = 0; j < valuesRange1.get(i).size(); j++) {
                            combinedRow.set(j, valuesRange1.get(i).get(j));
                        }
                    }

                    if (i < valuesRange2.size()) {
                        for (int j = 0; j < valuesRange2.get(i).size(); j++) {
                            combinedRow.set(columnsRange1 + j, valuesRange2.get(i).get(j));
                        }
                    }
                    return combinedRow;
                })
                .collect(Collectors.toList());

        int totalDays = 5;

        List<String> daysWeek = List.of("SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA");
        List<List<Object>> updatedValues = new ArrayList<>();
        
        for (int day = 0; day < totalDays; day++) {
            int start = day * CursosConstants.LINES_PER_DAYS_MEDIO;
            int end = Math.min(start + CursosConstants.LINES_PER_DAYS_MEDIO, combinedValues.size());
            updatedValues.add(List.of(daysWeek.get(day)));
            updatedValues.addAll(combinedValues.subList(start, end));
        }

        Horarios horarios = Horarios.builder()
            .rows(updatedValues)
            .maxColumns(columnsRange1 + columnsRange2)
            .courseName(curso.getNome())
            .checkTypeMedio(true)
            .build();
        return ResponseEntity.ok(horarios);
    }
}