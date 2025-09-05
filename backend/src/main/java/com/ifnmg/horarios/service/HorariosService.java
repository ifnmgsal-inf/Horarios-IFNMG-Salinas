package com.ifnmg.horarios.service;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.ifnmg.horarios.model.Horarios;
import com.ifnmg.horarios.model.Periodo;

@RequiredArgsConstructor
@Service
public class HorariosService {

    private final CursosMedioService cursosMedioService;
    private final CursosSuperiorService cursosSuperiorService;
    private final ProfessoresService professoresService;
    private final SalasService salasService;
    private final LoginService loginService;
    private final ValidacoesService validacoesService;
    private final PeriodosService periodosService;

    private String definirPeriodoId(String periodoId) throws IOException {
        if (periodoId == null || periodoId.isEmpty()) {
            Periodo atual = periodosService.getPeriodoAtual();
            if (atual != null) {
                return atual.getSheetId();
            }
        }
        return periodoId;
    }

    // Retornar os horários dos cursos técnicos
    public ResponseEntity<Horarios> getSheetsValuesMedio(String periodoId, String cursoSelecionado) throws IOException {
        return cursosMedioService.getSheetsValues(definirPeriodoId(periodoId), cursoSelecionado);
    }

    // Retornar os horários dos cursos superiores
    public ResponseEntity<Horarios> getSheetsValuesSuperior(String periodoId, String cursoSelecionado) throws IOException {
        return cursosSuperiorService.getSheetsValues(definirPeriodoId(periodoId), cursoSelecionado);
    }

    // Retornar os horários dos professores
    public ResponseEntity<Horarios> getSheetsValuesProfessores(String periodoId, String professorSelecionado) throws IOException {
        return professoresService.getSheetsValues(definirPeriodoId(periodoId), professorSelecionado);
    }

    // Retornar os horários de ocupação das salas
    public ResponseEntity<Horarios> getSheetsValuesSalas(String periodoId, String salaSelecionada) throws IOException {
        return salasService.getSheetsValues(definirPeriodoId(periodoId), salaSelecionada);
    }

    // Retornar autorização para ver validação da planilha
    public boolean getSheetsValuesLogin(String usuario, String senha) throws IOException {
        return loginService.getSheetsValues(usuario, senha);
    }

    // Retornar os dados para validação da planilha
    public ResponseEntity<Horarios> getSheetsValuesValidation(String periodoId) throws IOException {
        return validacoesService.getSheetsValues(definirPeriodoId(periodoId));
    }
    // Retornar os períodos
    public List<Periodo> getPeriodos() throws IOException {
        return periodosService.getPeriodos();
    }
    // Retornar o período atual
    public Periodo getPeriodoAtual() throws IOException {
        return periodosService.getPeriodoAtual();
    }
}