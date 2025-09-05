package com.ifnmg.horarios.config;

import io.github.cdimascio.dotenv.Dotenv;

public class EnvConfig {
    private static final Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
    // Variáveis de ambiente do projeto
    public static final String API_KEY = getEnvVar("API_KEY");
    public static final String SPREADSHEET_LOGIN = getEnvVar("SPREADSHEET_LOGIN");
    public static final String FRONTEND_URL = getEnvVar("FRONTEND_URL");

    private EnvConfig() {
    }

    private static String getEnvVar(String key) {
        String value = System.getenv(key);
        if (value == null) {
            value = dotenv.get(key);
        }
        return value;
    }
}