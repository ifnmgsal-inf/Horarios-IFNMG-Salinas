package com.ifnmg.horarios;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootTest
class HorariosApplicationTests {
    private static final Dotenv dotenv = Dotenv.configure().load();
	// Carregar variáveis de ambiente antes de fazer os testes
	@BeforeAll
    public static void setUp() {
        System.setProperty("API_KEY", dotenv.get("API_KEY"));
		System.setProperty("SPREADSHEET_LOGIN", dotenv.get("SPREADSHEET_LOGIN"));
		System.setProperty("FRONTEND_URL", dotenv.get("FRONTEND_URL"));
    }

	@Test
	void contextLoads() {
	}

}