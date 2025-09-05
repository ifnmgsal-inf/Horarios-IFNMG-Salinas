package com.ifnmg.horarios.service;

import java.io.IOException;
import java.text.Collator;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ifnmg.horarios.constants.ProfessoresSalasConstants;
import com.ifnmg.horarios.model.Horarios;

@Service
public class ProfessoresService {
        
    private final SheetsService sheetsService;

    public ProfessoresService(SheetsService sheetsService) {
        this.sheetsService = sheetsService;
    }

    public ResponseEntity<Horarios> getSheetsValues(String periodoId, String professorSelecionado) throws IOException {
        
        List<List<Object>> valuesSuperior1 = sheetsService.getSheetValues(periodoId, ProfessoresSalasConstants.RANGE_SUPERIOR_1);
        List<List<Object>> valuesSuperior2 = sheetsService.getSheetValues(periodoId, ProfessoresSalasConstants.RANGE_SUPERIOR_2);
        List<List<Object>> valuesSuperiorTurmas = sheetsService.getSheetValues(periodoId, ProfessoresSalasConstants.RANGE_SUPERIOR_TURMAS);
        List<List<Object>> valuesMedio2 = sheetsService.getSheetValues(periodoId, ProfessoresSalasConstants.RANGE_MEDIO_2);
        List<List<Object>> valuesMedioTurmas = sheetsService.getSheetValues(periodoId, ProfessoresSalasConstants.RANGE_MEDIO_TURMAS);
        List<List<Object>> nomesProfessores = sheetsService.getSheetValues(periodoId, ProfessoresSalasConstants.RANGE_PROFESSORES);

        Collator collator = Collator.getInstance(Locale.forLanguageTag("pt-BR"));
        List<String> nomesProfessoresValidos = nomesProfessores.stream()
                .filter(row -> !row.isEmpty())
                .map(row -> row.get(0).toString())
                .sorted(collator::compare)
                .collect(Collectors.toList());

        if (professorSelecionado == null || professorSelecionado.isEmpty()) {
            Horarios horarios = Horarios.builder()
                .professorSelecionado(professorSelecionado)
                .professores(nomesProfessoresValidos)
                .rows(new ArrayList<>())
                .maxRows(0)
                .build();
            return ResponseEntity.ok(horarios);
        }

        int totalDays = 5;

        List<List<Object>> valuesMedio2Adjusted = new ArrayList<>();
        
        for (int day = 0; day < totalDays; day++) {
            int start = day * ProfessoresSalasConstants.LINES_PER_DAY_MEDIO;
            int end = start + ProfessoresSalasConstants.LINES_PER_DAY_MEDIO - 2;

            for (int i = start; i < end; i++) {
                if (i < valuesMedio2.size()) {
                    valuesMedio2Adjusted.add(valuesMedio2.get(i));
                } else {
                    valuesMedio2Adjusted.add(new ArrayList<>(Collections.nCopies(ProfessoresSalasConstants.COLUMNS_MEDIO_2, "")));
                }
            }

            while (valuesMedio2Adjusted.size() % ProfessoresSalasConstants.LINES_PER_DAY_SUPERIOR != 0) {
                valuesMedio2Adjusted.add(new ArrayList<>(Collections.nCopies(ProfessoresSalasConstants.COLUMNS_MEDIO_2, "")));
            }
        }

        final String professorFiltrado = professorSelecionado.toLowerCase();
        List<List<Object>> combinedValues = IntStream.range(0, Math.max(valuesSuperior1.size(), Math.max(valuesSuperior2.size(), valuesMedio2Adjusted.size())))
                .mapToObj(i -> {
                    List<Object> combinedRow = new ArrayList<>(Collections.nCopies(ProfessoresSalasConstants.COLUMNS_SUPERIOR_1 + ProfessoresSalasConstants.COLUMNS_SUPERIOR_2, ""));

                    if (i < valuesSuperior1.size()) {
                        combinedRow.set(0, valuesSuperior1.get(i).get(0));
                    }

                    List<Object> superiorData = i < valuesSuperior2.size() ? valuesSuperior2.get(i) : new ArrayList<>();
                    List<Object> medioData = i < valuesMedio2Adjusted.size() ? valuesMedio2Adjusted.get(i) : new ArrayList<>();

                    addDisciplina(professorFiltrado, valuesSuperiorTurmas, superiorData, combinedRow);
                    addDisciplina(professorFiltrado, valuesMedioTurmas, medioData, combinedRow);
                    return combinedRow;
                })
                .collect(Collectors.toList());

        List<List<Object>> updatedValues = new ArrayList<>();
        
        for (int i = 0; i < ProfessoresSalasConstants.LINES_PER_DAY_SUPERIOR; i++) {
            List<Object> row = new ArrayList<>();
            for (int day = 0; day < totalDays; day++) {
                int start = day * ProfessoresSalasConstants.LINES_PER_DAY_SUPERIOR;
                if (start + i < combinedValues.size()) {
                    row.addAll(combinedValues.get(start + i).subList(0, Math.min(2, combinedValues.get(start + i).size())));
                }
            }
            updatedValues.add(row);
        }

        int horasPorColuna = 1;
        int colunasPreenchidas = 0;
        int totalHoras = 0;

        for (List<Object> row : updatedValues) {
            for (int i = 1; i < row.size(); i += 2) {
                if (row.get(i) != null && !row.get(i).toString().isEmpty()) {
                    colunasPreenchidas++;
                }
            }
        }
        totalHoras = colunasPreenchidas * horasPorColuna;

        Horarios horarios = Horarios.builder()
            .professorSelecionado(professorSelecionado)
            .professores(nomesProfessoresValidos)
            .rows(updatedValues)
            .horas(totalHoras + " h/a")
            .build();
        return ResponseEntity.ok(horarios);
    }
    
    private void addDisciplina(String professorFiltrado, List<List<Object>> valuesTurmas, List<Object> horariosData, List<Object> combinedRow)  {
        for (int j = 0; j < horariosData.size(); j++) {
            Object cellValue = horariosData.get(j);
            if (cellValue != null && !cellValue.toString().isEmpty()) {
                String cellValueStr = cellValue.toString();
                
                Pattern pattern = Pattern.compile("\\(([^)]+)\\)");
                Matcher matcher = pattern.matcher(cellValueStr);

                List<String> turmasProfessor = new ArrayList<>();

                while (matcher.find()) {
                    String professores = matcher.group(1);
                    String[] nomes = professores.split("[/,]");

                    for (String nome : nomes) {
                        if (nome.trim().toLowerCase().contains(professorFiltrado)) {
                            String turma = valuesTurmas.get(0).get(j).toString();
                            turmasProfessor.add(turma);
                        }
                    }
                }
                
                if (!turmasProfessor.isEmpty()) {
                    String dis = combinedRow.get(1).toString();
                    String novaParte = cellValueStr + " - " + String.join(" - ", turmasProfessor);

                    if (dis.isEmpty()) {
                        combinedRow.set(1, novaParte);
                    } else {
                        combinedRow.set(1, dis + " + " + novaParte);
                    }
                }
            }
        }
    }
}