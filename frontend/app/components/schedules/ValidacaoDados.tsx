import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { fetchValidacaoData } from '../../api/routes';
import TabelaValidacao from '../tables/TabelaValidacao';
// O componente mostra uma tabela com a lista de validações, retorna o resultado se cada uma foi atendida com 'SIM' ou 'NÃO' e mostra o resultado final
export default function ValidacaoDados() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPeriodoId = searchParams.get('periodoId') ?? (typeof window !== 'undefined' ? localStorage.getItem('periodoId') : null) ?? '';

  useEffect(() => {
    const handleBackButton = () => {
      window.location.replace('/');
    };
    
    const autenticado = typeof window !== 'undefined' && localStorage.getItem('autenticado') === 'true';

    if (!autenticado) {
      if (initialPeriodoId) {
        localStorage.setItem('periodoId', initialPeriodoId);
        router.replace(`/pages/Login?periodoId=${encodeURIComponent(initialPeriodoId)}`);
      } else {
        router.replace('/pages/Login');
      }
      return;
    }
  
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handleBackButton);
  
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [router, initialPeriodoId]);
  
  const [rows, setRows] = useState<(string | null)[][]>([]);
  const [validacoes, setValidacoes] = useState<string[]>([]);
  const [mensagem, setMensagem] = useState('');
  const getPeriodoId = () => {
    const fromUrl = searchParams.get('periodoId');
    if (fromUrl) {
      return fromUrl;
    }
    return typeof window !== 'undefined' ? localStorage.getItem('periodoId') ?? '' : '';
  };

  const fetchData = async () => {
    try {
      const periodoId = getPeriodoId();
      const data = await fetchValidacaoData(periodoId);
      setRows(data.rows || []);
      setValidacoes(data.validacoes || []);
      if ((data.rows || []).length === 0 && data.validacoes?.[6] === "SIM") {
        setMensagem("✅ Todas as validações foram concluídas com sucesso, a planilha está em ótimo estado!");
        return;
      }
      setMensagem("⚠️ Foram encontradas inconsistências na planilha!");
    } catch (error) {
      console.error("Erro ao realizar a validação da planilha:", error);
      setMensagem("❌ Erro ao realizar a validação da planilha!");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="min-h-screen container mx-auto px-2 py-6">
        <h1 className="font-sans font-semibold text-center text-3xl mb-4 text-black dark:text-white">Validação de Dados</h1>
        <div className="flex flex-col items-center mb-4 text-black dark:text-white">
          <button onClick={fetchData} className="cursor-pointer font-sans font-bold bg-cyan-600 dark:bg-white text-white dark:text-black py-2 px-4 rounded hover:bg-cyan-500 dark:hover:bg-neutral-200 active:bg-cyan-700 dark:active:bg-neutral-500">
            Iniciar
          </button>
        </div>

        <div className="overflow-x-auto">
          <TabelaValidacao rows={rows} validacoes={validacoes} />
        </div>
        <div className="flex flex-col items-center mt-4">
          {mensagem && (
            <p className="text-center font-sans font-bold bg-neutral-500 dark:bg-white p-3 rounded-md inline-block text-white dark:text-black">
              {mensagem}
            </p>
          )}
          <div className="mt-4">
            <button onClick={() => { 
                localStorage.removeItem('autenticado');
                localStorage.removeItem('periodoId');
                router.replace('/pages/Login'); 
              }} 
              className="cursor-pointer font-sans font-bold bg-red-700 dark:bg-black text-white px-4 py-2 rounded-md hover:bg-red-600 dark:hover:bg-neutral-800 transition dark:border border-bg-neutral-500 active:bg-red-800 dark:active:bg-neutral-600">
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}