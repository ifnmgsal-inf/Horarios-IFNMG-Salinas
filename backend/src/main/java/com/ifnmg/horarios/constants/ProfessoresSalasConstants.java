package com.ifnmg.horarios.constants;

import java.util.List;

public class ProfessoresSalasConstants {
    public static final String GUIA_PROFESSOR = "Validação de Dados";
    
    public static final String RANGE_MEDIO_2 = "Horário - Ensino Médio!C3:Z76";
    public static final String RANGE_MEDIO_TURMAS = "Horário - Ensino Médio!C2:Z2";

    public static final int COLUMNS_MEDIO_2 = 24;
    public static final int LINES_PER_DAY_MEDIO = 15;
    
    public static final String RANGE_SUPERIOR_1 = "Horário - Graduação!B3:B106";
    public static final String RANGE_SUPERIOR_2 = "Horário - Graduação!C3:AW106";
    public static final String RANGE_SUPERIOR_TURMAS = "Horário - Graduação!C2:AW2";

    public static final int COLUMNS_SUPERIOR_1 = 1;
    public static final int COLUMNS_SUPERIOR_2 = 47;
    public static final int LINES_PER_DAY_SUPERIOR = 21;

    public static final String RANGE_PROFESSORES = "Validação de Dados!A2:A";

    private ProfessoresSalasConstants() {
    }
    // Lista de salas disponíveis
    public static final List<String> SALAS = List.of(
        "(1/3)", "(1/4)", "(1/5)", "(1/6)", "(1/7)", "(1/8)", "(1/9)", "(1/10)", "(1/11)", "(1/12)", "(1/13)", "(1/14)", 
        "(1/15)", "(1/16)", "(1/17)", "(2/1)", "(2/2)", "(2/3)", "(2/4)", "(2/5)", "(2/6)", "(3/7)", "(3/8)", "(3/9)", 
        "(3/10)", "(3/11)", "(Agricult. I)", "(Agricult. II)", "(Agricult. III)", "(Agroin. 1)", "(Agroin. 2)", 
        "(Anexo Lab. Solos)", "(CELIN 1)", "(CELIN 2)", "(HV 1)", "(HV 2)", "(HV 3)", "(HV 4)", "(Lab. 1 - Info)", 
        "(Lab. 2 - Info)", "(Lab. 3 - Info)", "(Lab. 4 - Info)", "(Lab. Bromatologia)", "(Lab. Fenôm. de Transportes)", 
        "(Lab. Física)", "(Lab. Invertebrados)", "(Lab. Microscopia)", "(Lab. Química I)", "(Lab. Química II)", 
        "(Lab. Redes)", "(LEM)", "(Mini 1)", "(Mini 2)", "(Sala de Topografia)", "(Sala Suinocultura)", 
        "(Sl. Análise Sensorial)", "(Zoo I)", "(Zoo II)", "(Zoo III)"
    );
}
