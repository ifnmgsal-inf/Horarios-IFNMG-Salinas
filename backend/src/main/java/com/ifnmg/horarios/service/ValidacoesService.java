package com.ifnmg.horarios.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.function.BiConsumer;
import java.util.function.Function;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ifnmg.horarios.constants.CursosConstants;
import com.ifnmg.horarios.constants.ProfessoresSalasConstants;
import com.ifnmg.horarios.model.Horarios;

@Service
public class ValidacoesService {
        
    private final SheetsService sheetsService;

    public ValidacoesService(SheetsService sheetsService) {
        this.sheetsService = sheetsService;
    }

    public ResponseEntity<Horarios> getSheetsValues(String periodoId) throws IOException {
        
        List<String> validacoes = new ArrayList<>();
        List<List<Object>> valuesSuperior = new ArrayList<>();
        List<List<Object>> valuesMedio = new ArrayList<>();
        List<List<Object>> valuesValidacao = new ArrayList<>();
        List<List<Object>> celulasInvalidas = new ArrayList<>();
    
        boolean guiaMedioExiste = false;
        boolean guiaSuperiorExiste = false;
        boolean guiaValidacaoExiste = false;
    
        boolean intervaloMedioValido = false;
        boolean intervaloSuperiorValido = false;
        boolean intervaloValidacaoValido = false;

        try {
            valuesMedio = sheetsService.getSheetValues(periodoId, CursosConstants.RANGE_MEDIO);
            guiaMedioExiste = true;
            intervaloMedioValido = valuesMedio.size() == CursosConstants.QTD_LINHAS_MEDIO && valuesMedio.get(0).size() == CursosConstants.QTD_COLUNAS_MEDIO;
        } catch (Exception e) {
            System.err.println("Erro ao acessar a guia 'Horário - Ensino Médio' " + e.getMessage());
        }
    
        try {
            valuesSuperior = sheetsService.getSheetValues(periodoId, CursosConstants.RANGE_SUPERIOR);
            guiaSuperiorExiste = true;
            intervaloSuperiorValido = valuesSuperior.size() == CursosConstants.QTD_LINHAS_SUPERIOR && valuesSuperior.get(0).size() == CursosConstants.QTD_COLUNAS_SUPERIOR;
        } catch (Exception e) {
            System.err.println("Erro ao acessar a guia 'Horário - Graduação' " + e.getMessage());
        }
    
        try {
            valuesValidacao = sheetsService.getSheetValues(periodoId, ProfessoresSalasConstants.RANGE_PROFESSORES);
            guiaValidacaoExiste = true;
            intervaloValidacaoValido = !valuesValidacao.isEmpty() && valuesValidacao.get(0).size() >= 1; // Se está vazio & Qtd Colunas
        } catch (Exception e) {
            System.err.println("Erro ao acessar a guia 'Validação de Dados' " + e.getMessage());
        }

        validacoes.add(guiaMedioExiste ? "SIM" : "NÃO");
        validacoes.add(guiaSuperiorExiste ? "SIM" : "NÃO");
        validacoes.add(guiaValidacaoExiste ? "SIM" : "NÃO");
        validacoes.add(intervaloMedioValido ? "SIM" : "NÃO");
        validacoes.add(intervaloSuperiorValido ? "SIM" : "NÃO");
        validacoes.add(intervaloValidacaoValido ? "SIM" : "NÃO");
    
        Function<Integer, String> getExcelColumnName = index -> {
            StringBuilder columnName = new StringBuilder();
            index += 1;
            while (index > 0) {
                int rem = (index - 1) % 26;
                columnName.insert(0, (char) (rem + 'A'));
                index = (index - 1) / 26;
            }
            return columnName.toString();
        };
    
        BiConsumer<List<List<Object>>, String> verificarParenteses = (planilha, nomeGuia) -> {
            for (int i = 0; i < planilha.size(); i++) {
                List<Object> linha = planilha.get(i);
                for (int j = 0; j < linha.size(); j++) {
                    String valor = linha.get(j).toString().trim();
        
                    long abre = valor.chars().filter(ch -> ch == '(').count();
                    long fecha = valor.chars().filter(ch -> ch == ')').count();
                    boolean contemParenteses = valor.contains("(") || valor.contains(")");
                    boolean valido = !contemParenteses;
                    
                    if (contemParenteses && (abre + fecha) % 2 == 0) {
                        int pos = 0;
                        boolean ordemCorreta = true;

                        for (char ch : valor.toCharArray()) {
                            if (ch == '(') {
                                pos++;
                            } else if (ch == ')') {
                                pos--;
                                if (pos < 0) {
                                    ordemCorreta = false;
                                    break;
                                }
                            }
                        }
                        valido = ordemCorreta && pos == 0;
                    }

                    if (!valido) {
                        String coluna = "A";
                        if (!nomeGuia.equals(ProfessoresSalasConstants.GUIA_PROFESSOR)) {
                            coluna = getExcelColumnName.apply(j + 1);
                        }
        
                        String linhaPlanilha = String.valueOf(i + 2);
                        String posicao = nomeGuia + ": " + coluna + linhaPlanilha;
                        celulasInvalidas.add(Arrays.asList(posicao));
                    }
                }
            }
        };

        if (intervaloMedioValido) {
            verificarParenteses.accept(valuesMedio, CursosConstants.GUIA_MEDIO);
        }
    
        if (intervaloSuperiorValido) {
            verificarParenteses.accept(valuesSuperior, CursosConstants.GUIA_SUPERIOR);
        }
    
        if (intervaloValidacaoValido) {
            verificarParenteses.accept(valuesValidacao, ProfessoresSalasConstants.GUIA_PROFESSOR);
        }
    
        boolean nenhumaGuiaExiste = !guiaMedioExiste && !guiaSuperiorExiste && !guiaValidacaoExiste;
        boolean algumIntervaloInvalido = !intervaloMedioValido || !intervaloSuperiorValido || !intervaloValidacaoValido;

        if (nenhumaGuiaExiste || algumIntervaloInvalido) {
            validacoes.add("NÃO");
        } else {
            validacoes.add(celulasInvalidas.isEmpty() ? "SIM" : "NÃO");
        }
    
        celulasInvalidas.sort(Comparator.comparing(o -> o.get(0).toString()));
    
        Horarios horarios = Horarios.builder()
            .validacoes(validacoes)
            .rows(celulasInvalidas)
            .maxRows(celulasInvalidas.size())
            .build();
        return ResponseEntity.ok(horarios);
    }
}