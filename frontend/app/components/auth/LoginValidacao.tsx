import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { fetchLoginData } from '../../api/routes';
import BotaoVoltar from '../common/buttons/BackButton';
// Componente para verificar credenciais de login antes de entrar na tela de validação
export default function LoginValidacao() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const periodoIdFromUrl = searchParams.get('periodoId') ?? '';
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState({ usuario: false, senha: false });
  const [mensagemErro, setMensagemErro] = useState('');

  useEffect(() => {
    if (periodoIdFromUrl) {
      localStorage.setItem('periodoId', periodoIdFromUrl);
    }
  }, [periodoIdFromUrl]);

  const validarCampos = async () => {
    const usuarioValido = usuario.trim() !== '';
    const senhaValida = senha.trim() !== '';
  
    const novosErros = {
      usuario: !usuarioValido,
      senha: !senhaValida,
    };
    setErros(novosErros);
  
    const camposValidos = usuarioValido && senhaValida;
    if (!camposValidos) return;
  
    try {
      await fetchLoginData(usuario.trim(), senha.trim());
      localStorage.setItem('autenticado', 'true');
      
      const periodoId = periodoIdFromUrl || (typeof window !== 'undefined' ? localStorage.getItem('periodoId') ?? '' : '');

      if (periodoId) {
        router.replace(`/pages/Validacao?periodoId=${encodeURIComponent(periodoId)}`);
      } else {
        router.replace('/pages/Validacao');
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        setMensagemErro("Usuário ou senha inválidos!");
        return;
      }
      setMensagemErro("Erro ao realizar o login!");
      console.error("Erro no login:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-neutral-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-black border-t-4 border-green-700 dark:border-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
        <div className="w-full flex justify-center mb-8">
          <div className="block dark:hidden">
            <Image
              src="/salinas_horizontal_white.jpg"
              alt="Logo do Campus Salinas - White"
              width={512}
              height={275}
              className="object-contain w-full max-w-xs md:max-w-md rounded-md"
              priority={true}
            />
          </div>
          <div className="hidden dark:block">
            <Image
              src="/salinas_horizontal_dark.jpg"
              alt="Logo do Campus Salinas - Dark"
              width={512}
              height={275}
              className="object-contain w-full max-w-xs md:max-w-md rounded-md"
              priority={true}
            />
          </div>
        </div>

        <h1 className="font-sans font-bold text-xl md:text-2xl mb-8 text-black dark:text-white">
          Preencha os campos para entrar
        </h1>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-md space-y-4 flex flex-col items-center">
            <input
              type="text"
              placeholder="Usuário"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              onFocus={() => setMensagemErro('')}
              className={`w-full px-4 py-3 rounded-lg border ${erros.usuario ? 'border-red-500' : 'border-gray-300'} 
                placeholder-gray-400 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            />
            {erros.usuario && (
              <p className="text-sm text-red-600 font-medium -mt-2 w-full text-left">&quot;Usuário&quot; não pode ficar em branco</p>
            )}

            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onFocus={() => setMensagemErro('')}
              className={`w-full px-4 py-3 rounded-lg border ${erros.senha ? 'border-red-500' : 'border-gray-300'}
                placeholder-gray-400 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            />
            {erros.senha && (
              <p className="text-sm text-red-600 font-medium -mt-2 w-full text-left">&quot;Senha&quot; não pode ficar em branco</p>
            )}
            <button onClick={validarCampos} className="cursor-pointer font-sans font-bold w-full text-center py-3 bg-blue-600 dark:bg-white hover:bg-blue-500 dark:hover:bg-neutral-200 text-white dark:text-black rounded-lg transition active:bg-blue-700 dark:active:bg-neutral-500">
              Acessar
            </button>
            {mensagemErro && (
              <div className="mt-4 bg-red-200 text-red-800 text-sm p-3 rounded-lg">
                {mensagemErro}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <BotaoVoltar />
      </div>
    </div>
  );
}