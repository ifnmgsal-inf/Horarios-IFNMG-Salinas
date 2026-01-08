## 1. Descrição

O projeto é uma plataforma web que mostra os horários dos cursos, professores e ocupação de salas do IFNMG Campus Salinas. O objetivo do projeto é facilitar o acesso aos horários para melhor organização e auxiliar o setor de ensino na manutenção da planilha. Ou seja, os dados são recebidos da planilha para o aplicativo.

## 2. Branches

- `main`: Branch de **produção**, utilizado para o deploy da plataforma.
- `dev`: Branch de **desenvolvimento**, usado para implementar e testar novas funcionalidades localmente antes de serem enviadas para a produção.

## 3. Tecnologias utilizadas

### Front-end

- [Figma](https://www.figma.com/)
- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/) (Deploy)

### Back-end

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Google Sheets](https://docs.google.com/spreadsheets/u/0/)
- [Google Sheets API](https://developers.google.com/sheets/api/reference/rest?hl=pt-br)
- [Docker](https://docs.docker.com/reference/dockerfile/)
- [Koyeb](https://www.koyeb.com/) (Deploy)

### Ambiente de Desenvolvimento

- [Visual Studio Code](https://code.visualstudio.com/)

## 4. Instalação

- Antes da instalação certifique-se de ter o [Node.js](https://nodejs.org) instalado na sua máquina.

- Para começar, clone este repositório para o seu ambiente local:

```
git clone https://github.com/ifnmgsal-inf/Horarios-IFNMG-Salinas.git
```

- Em seguida, execute o comando abaixo dentro da pasta `frontend`, dependendo de qual gerenciador de pacotes você preferir, para instalar as dependências do projeto:

```
npm install
```

- Isso instalará todas as dependências listadas no arquivo `package.json`

## 5. Execução

- Para iniciar o projeto em modo de desenvolvimento

#### Front-end

- Você pode executar o seguinte comando dentro da pasta `frontend`:

```
npm run dev
```

#### Back-end

- Dentro da pasta `backend` você tem que executar o arquivo `HorariosApplication.java`

## 6. Build

- Para criar uma versão de produção do projeto

#### Front-end

- Você pode executar o seguinte comando abaixo dentro da pasta `frontend`:

```
npm run build
```

#### Back-end

- Para isso tenho o [Maven](https://maven.apache.org/download.cgi) instalado na sua máquina.
- Dentro da pasta `backend`, você pode executar o seguinte comando:
```
mvn package
```

### 7. Variáveis de ambiente

Você pode configurar essas variáveis de ambiente criando um arquivo `.env` na raiz das pastas `backend` e `frontend` do projeto e definindo as variáveis.

#### Back-end
- `API_KEY`: URL da API do Google Sheets.
- `SPREADSHEET_LOGIN`: URL da Planilha do Google Sheets do Login.
- `FRONTEND_URL`: URL do Front-end.

Exemplo:

```env
API_KEY=AIzaS...
SPREADSHEET_LOGIN=1CKEFgTwz7k22222VytFDGMlYWyTqf2Zq8HbzcQJHKVI
FRONTEND_URL=http://localhost:3000
```

#### Front-end
- `NEXT_PUBLIC_BACKEND_URL`: URL do Back-end.

Exemplo:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

## 8. Documentação da Planilha

- [Documentação](https://ifnmgsal-inf.github.io/Horarios-IFNMG-Salinas/)

## 9. Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.
