package com.ifnmg.horarios.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.function.BiFunction;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ifnmg.horarios.constants.CursosConstants;
import com.ifnmg.horarios.model.Curso;
import com.ifnmg.horarios.model.Horarios;

@Service
public class CursosSuperiorService {
    
    private final SheetsService sheetsService;

    public CursosSuperiorService(SheetsService sheetsService) {
        this.sheetsService = sheetsService;
    }

    public ResponseEntity<Horarios> getSheetsValues(String periodoId, String cursoSelecionado) throws IOException {

        Curso curso = CursosConstants.CURSOS_SUPERIOR.getOrDefault(cursoSelecionado, CursosConstants.CURSOS_SUPERIOR.get("default"));

        List<List<Object>> valuesRange1 = sheetsService.getSheetValues(periodoId, CursosConstants.RANGE_HORAS_SUPERIOR);
        List<List<Object>> valuesRange2 = sheetsService.getSheetValues(periodoId, CursosConstants.getRangeCompletoSuperior(curso));

        List<List<Object>> updatedValues = processValuesForCourse(cursoSelecionado, valuesRange1, valuesRange2);

        Horarios horarios = Horarios.builder()
            .rows(updatedValues)
            .maxColumns(calculateMaxColumns(valuesRange1, valuesRange2))
            .courseName(curso.getNome())
            .checkTypeMedio(false)
            .build();
        return ResponseEntity.ok(horarios);
    }

    private List<List<Object>> processValuesForCourse(String cursoSelecionado, List<List<Object>> valuesRange1, List<List<Object>> valuesRange2) {
        if (CursosConstants.IGNORE_LAST_LINES.containsKey(cursoSelecionado)) {
            return processDayValues(valuesRange1, valuesRange2, CursosConstants.IGNORE_LAST_LINES.get(cursoSelecionado));
        }
        if (CursosConstants.SKIP_INITIAL_LINES.containsKey(cursoSelecionado)) {
            return processFilteredValues(valuesRange1, valuesRange2, CursosConstants.SKIP_INITIAL_LINES.get(cursoSelecionado));
        }
        return processDayValues(valuesRange1, valuesRange2, 0);
    }

    private int calculateMaxColumns(List<List<Object>> valuesRange1, List<List<Object>> valuesRange2) {
        int columnsRange1 = 1;
        int columnsRange2 = valuesRange2.isEmpty() ? 0 : valuesRange2.get(0).size();
        return columnsRange1 + columnsRange2;
    }

    private List<List<Object>> processDayValues(List<List<Object>> valuesRange1, List<List<Object>> valuesRange2, int ignoreLastLines) {
        return processDayValues((start, end) -> IntStream.range(start, end - ignoreLastLines)
                .mapToObj(i -> combineRow(valuesRange1, valuesRange2, i))
                .collect(Collectors.toList()));
    }

    private List<List<Object>> processFilteredValues(List<List<Object>> valuesRange1, List<List<Object>> valuesRange2, int skipInitialLines) {
        return processDayValues((start, end) -> IntStream.range(start, end)
                .filter(i -> (i == start || i > start + skipInitialLines))
                .mapToObj(i -> combineRow(valuesRange1, valuesRange2, i))
                .collect(Collectors.toList()));
    }

    private List<List<Object>> processDayValues(BiFunction<Integer, Integer, List<List<Object>>> getDayValues) {
        int totalDays = 5;
        
        List<String> daysWeek = List.of("SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA");
        List<List<Object>> updatedValues = new ArrayList<>();

        for (int day = 0; day < totalDays; day++) {
            int start = day * CursosConstants.LINES_PER_DAYS_SUPERIOR;
            int end = start + CursosConstants.LINES_PER_DAYS_SUPERIOR;
            updatedValues.add(List.of(daysWeek.get(day)));
            updatedValues.addAll(getDayValues.apply(start, end));
        }
        return updatedValues;
    }

    private List<Object> combineRow(List<List<Object>> valuesRange1, List<List<Object>> valuesRange2, int rowIndex) {
        int columnsRange1 = 1;
        int columnsRange2 = valuesRange2.isEmpty() ? 0 : valuesRange2.get(0).size();
        List<Object> combinedRow = new ArrayList<>(Collections.nCopies(columnsRange1 + columnsRange2, ""));
        fillRow(valuesRange1, combinedRow, rowIndex, 0);
        fillRow(valuesRange2, combinedRow, rowIndex, columnsRange1);
        return combinedRow;
    }

    private void fillRow(List<List<Object>> valuesRange, List<Object> combinedRow, int rowIndex, int offset) {
        if (rowIndex < valuesRange.size()) {
            for (int j = 0; j < valuesRange.get(rowIndex).size(); j++) {
                combinedRow.set(offset + j, valuesRange.get(rowIndex).get(j));
            }
        }
    }
}