import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});
// Buscar os horários dos cursos técnicos e superiores
export const fetchCourseData = async (periodoId: string, cursoSelecionado: string, tipo: string) => {
  const url = tipo === 'ensinoMedio' ? '/ensinoMedio' : '/ensinoSuperior';
  const response = await api.get(url, {
    params: { periodoId, cursoSelecionado }
  });
  return response.data;
};
// Buscar os horários dos professores
export const fetchProfessorData = async (periodoId: string, professorSelecionado: string) => {
  const response = await api.get('/professores', {
    params: { periodoId, professorSelecionado }
  });
  return response.data;
};
// Buscar os horários de ocupação das salas
export const fetchSalaData = async (periodoId: string, salaSelecionada: string) => {
  const response = await api.get('/salas', {
    params: { periodoId, salaSelecionada }
  });
  return response.data;
};
// Autenticar um usuário para ver validação da planilha
export const fetchLoginData = async (usuario: string, senha: string) => {
  const response = await api.get(`/login`, {
    params: { usuario, senha },
  });
  return response.data;
};
// Validar dados da planilha
export const fetchValidacaoData = async (periodoId: string) => {
  const response = await api.get(`/validacao`, {
    params: { periodoId }
  });
  return response.data;
};

// Buscar todos os períodos
export const fetchPeriodosData = async () => {
  const url = `/periodos`;
  const response = await api.get(url);
  return response.data;
};

// Buscar período atual
export const fetchPeriodoAtualData = async () => {
  const url = `/periodoAtual`;
  const response = await api.get(url);
  return response.data;
};

export default api;