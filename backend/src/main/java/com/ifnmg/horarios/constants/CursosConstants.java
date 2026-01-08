package com.ifnmg.horarios.constants;

import java.util.Map;

import com.ifnmg.horarios.model.Curso;

public class CursosConstants {
    public static final String GUIA_MEDIO = "Horário - Ensino Médio";
    
    public static final String RANGE_MEDIO = "Horário - Ensino Médio!B2:Z76";
    public static final String RANGE_HORAS_MEDIO = GUIA_MEDIO + "!B2:B76";
    
    public static final int LINES_PER_DAYS_MEDIO = 15;
    public static final int QTD_COLUNAS_MEDIO = 25;
    public static final int QTD_LINHAS_MEDIO = 75;
    
    public static final String GUIA_SUPERIOR = "Horário - Graduação";
    
    public static final String RANGE_SUPERIOR = "Horário - Graduação!B2:AW106";
    public static final String RANGE_HORAS_SUPERIOR = GUIA_SUPERIOR + "!B2:B106";
    
    public static final int LINES_PER_DAYS_SUPERIOR = 21;
    public static final int QTD_COLUNAS_SUPERIOR = 48;
    public static final int QTD_LINHAS_SUPERIOR = 105;
    
    private CursosConstants() {
    }
    // Lista de cursos técnicos disponíveis
    public static final Map<String, Curso> CURSOS_MEDIO = Map.ofEntries(
        Map.entry("agroindustria", new Curso("Técnico em Agroindústria", "C2", "H76")),
        Map.entry("agropecuaria", new Curso("Técnico em Agropecuária", "J2", "O76")),
        Map.entry("informatica", new Curso("Técnico em Informática", "Q2", "V76")),
        Map.entry("quimica", new Curso("Técnico em Química", "X2", "X76")),
        Map.entry("ambiente", new Curso("Técnico em Meio Ambiente", "Z2", "Z76")),
        Map.entry("default", new Curso("Todos os Cursos - Ensino Médio", "C2", "Z76"))
    );
    // Lista de cursos superiores disponíveis
    public static final Map<String, Curso> CURSOS_SUPERIOR = Map.ofEntries(
        Map.entry("engenharia_alimentos", new Curso("Bacharelado em Engenharia de Alimentos", "C2", "G106")),
        Map.entry("engenharia_florestal", new Curso("Bacharelado em Engenharia Florestal", "I2", "M106")),
        Map.entry("sistemas_informacao", new Curso("Bacharelado em Sistemas de Informação", "O2", "R106")),
        Map.entry("medicina_veterinaria", new Curso("Bacharelado em Medicina Veterinária", "T2", "X106")),
        Map.entry("biologia", new Curso("Licenciatura em Ciências Biológicas", "Z2", "AC106")),
        Map.entry("fisica", new Curso("Licenciatura em Física", "AE2", "AH106")),
        Map.entry("matematica", new Curso("Licenciatura em Matemática", "AJ2", "AM106")),
        Map.entry("quimica", new Curso("Licenciatura em Química", "AO2", "AR106")),
        Map.entry("pedagogia", new Curso("Licenciatura em Pedagogia", "AT2", "AW106")),
        Map.entry("default", new Curso("Todos os Cursos - Ensino Superior", "C2", "AW106"))
    );
    // Qtd de linhas para ignorar no final de cada dia da semana para alguns cursos superiores
    public static final Map<String, Integer> IGNORE_LAST_LINES = Map.of(
        "engenharia_alimentos", 5,
        "engenharia_florestal", 5,
        "medicina_veterinaria", 5
    );
    // Qtd de linhas para pular no início de cada dia da semana para alguns cursos superiores
    public static final Map<String, Integer> SKIP_INITIAL_LINES = Map.of(
        "sistemas_informacao", 7,
        "biologia", 14,
        "fisica", 14,
        "matematica", 14,
        "quimica", 14,
        "pedagogia", 14
    );
    // Gerar intervalo que será usado na função dos cursos técnicos
    public static String getRangeCompletoMedio(Curso curso) {
        return GUIA_MEDIO + "!" + curso.getRangeStart() + ":" + curso.getRangeEnd();
    }
    // Gerar intervalo que será usado na função dos cursos superiores
    public static String getRangeCompletoSuperior(Curso curso) {
        return GUIA_SUPERIOR + "!" + curso.getRangeStart() + ":" + curso.getRangeEnd();
    }
}
