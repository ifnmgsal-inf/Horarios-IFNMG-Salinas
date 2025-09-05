"use client";

import Link from 'next/link';
import Image from 'next/image';
import { BookOpenIcon, AcademicCapIcon, UserIcon, BuildingStorefrontIcon, CheckCircleIcon, BuildingOffice2Icon, ArrowPathIcon, CalendarDaysIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';
import { fetchPeriodosData, fetchPeriodoAtualData } from './api/routes';
import ListaSuspensa from './components/common/dropdowns/DropdownList';
// Menu principal da plataforma com opções de botões de horários e outros serviços
interface Periodo {
  nomePeriodo: string;
  sheetId: string;
}
export default function Home() {
  const currentYear = new Date().getFullYear();
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [periodoAtual, setPeriodoAtual] = useState<Periodo | null>(null);
  const [periodoSelecionado, setPeriodoSelecionado] = useState<Periodo | null>(null);
  const [, setLinkSelecionado] = useState<string>('');
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleCloseDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  useEffect(() => {
    const loadPeriodos = async () => {
      try {
        const data = await fetchPeriodosData();
        setPeriodos(data);
      } catch (err) {
        console.error('Erro ao buscar períodos', err);
      }
    };

    const loadPeriodoAtual = async () => {
      try {
        const atual = await fetchPeriodoAtualData();
        setPeriodoAtual(atual);
        setPeriodoSelecionado(atual);
        setLinkSelecionado(atual.sheetId);
        if (typeof window !== 'undefined') {
          localStorage.setItem('periodoId', atual.sheetId);
        }
      } catch (err) {
        console.error('Erro ao buscar período atual', err);
      }
    };
    loadPeriodos();
    loadPeriodoAtual();
  }, []);

  const handleSelecionar = () => {
    if (periodoSelecionado) {
      setLinkSelecionado(periodoSelecionado.sheetId);
      const isDifferent = periodoAtual && periodoSelecionado.sheetId !== periodoAtual.sheetId;

      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('periodoId', periodoSelecionado.sheetId);
        }
      } catch (e) {
        console.error('Não foi possível salvar periodoId no localStorage', e);
      }

      if (isDifferent && dialogRef.current) {
        dialogRef.current.showModal();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-neutral-900 flex flex-col items-center justify-center p-2">
      <div className="bg-white dark:bg-black border-t-4 border-green-700 dark:border-white p-6 rounded-lg shadow-lg text-center w-full max-w-4xl">
        <div className="w-full flex justify-center mb-4">
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
        <h1 className="font-sans font-bold text-3xl md:text-4xl mb-1 sm:mb-4 text-black dark:text-white">Horários - Campus Salinas</h1>
        <div className="mb-4 w-full flex flex-col sm:flex-row items-center justify-center gap-2">
          <h1 className="font-sans font-bold text-xl md:text-2xl text-black dark:text-white whitespace-nowrap flex items-center h-8">
            Período:
          </h1>
          <div className="relative min-w-[150px] max-w-[250px] h-12">
            <ListaSuspensa
              value={periodoSelecionado?.nomePeriodo || ''}
              onChange={(e) => {
                const periodo = periodos.find(p => p.nomePeriodo === e.target.value) || null;
                setPeriodoSelecionado(periodo);
              }}
              options={periodos.map(p => p.nomePeriodo)}
              label="(Disponíveis)"
            />
          </div>
          <button onClick={handleSelecionar} className="cursor-pointer font-sans font-bold bg-blue-700 dark:bg-neutral-500 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-neutral-600 active:bg-blue-800 dark:active:bg-neutral-800 mb-1">
            Selecionar
          </button>
        </div>
        <div className="font-sans font-semibold grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="pages/Cursos?tipo=ensinoMedio" className="block w-full h-28 bg-green-700 dark:bg-white text-white dark:text-black text-center text-xl md:text-2xl rounded-md hover:bg-green-600 dark:hover:bg-neutral-300 transition-all duration-500 flex flex-col items-center justify-center shadow-lg hover:shadow-xl active:bg-green-800 dark:active:bg-neutral-500 active:shadow-inner">
            <BookOpenIcon className="h-8 w-8 md:h-10 md:w-10 mb-1 transform transition-transform duration-300" />
            Ensino Médio
          </Link>
          <Link href="pages/Cursos?tipo=ensinoSuperior" className="block w-full h-28 bg-green-700 dark:bg-white text-white dark:text-black text-center text-xl md:text-2xl rounded-md hover:bg-green-600 dark:hover:bg-neutral-300 transition-all duration-500 flex flex-col items-center justify-center shadow-lg hover:shadow-xl active:bg-green-800 dark:active:bg-neutral-500 active:shadow-inner">
            <AcademicCapIcon className="h-8 w-8 md:h-10 md:w-10 mb-1 transform transition-transform duration-300" />
            Ensino Superior
          </Link>
          <Link href="pages/Professores" className="block w-full h-28 bg-green-700 dark:bg-white text-white dark:text-black text-center text-xl md:text-2xl rounded-md hover:bg-green-600 dark:hover:bg-neutral-300 transition-all duration-500 flex flex-col items-center justify-center shadow-lg hover:shadow-xl active:bg-green-800 dark:active:bg-neutral-500 active:shadow-inner">
            <UserIcon className="h-8 w-8 md:h-10 md:w-10 mb-1 transform transition-transform duration-300" />
            Professores
          </Link>
          <Link href="pages/Salas" className="block w-full h-28 bg-green-700 dark:bg-white text-white dark:text-black text-center text-xl md:text-2xl rounded-md hover:bg-green-600 dark:hover:bg-neutral-300 transition-all duration-500 flex flex-col items-center justify-center shadow-lg hover:shadow-xl active:bg-green-800 dark:active:bg-neutral-500 active:shadow-inner">
            <BuildingStorefrontIcon className="h-8 w-8 md:h-10 md:w-10 mb-1 transform transition-transform duration-300" />
            Salas
          </Link>
          <Link href="pages/Login" className="block w-full h-28 bg-green-700 dark:bg-white text-white dark:text-black text-center text-xl md:text-2xl rounded-md hover:bg-green-600 dark:hover:bg-neutral-300 transition-all duration-500 flex flex-col items-center justify-center shadow-lg hover:shadow-xl active:bg-green-800 dark:active:bg-neutral-500 active:shadow-inner">
            <CheckCircleIcon className="h-8 w-8 md:h-10 md:w-10 mb-1 transform transition-transform duration-300" />
            Validação de Dados
          </Link>
          <a href="https://www.thinglink.com/card/1628905558578823171" target="_blank" className="block w-full h-28 bg-green-700 dark:bg-white text-white dark:text-black text-center text-xl md:text-2xl rounded-md hover:bg-green-600 dark:hover:bg-neutral-300 transition-all duration-500 flex flex-col items-center justify-center shadow-lg hover:shadow-xl active:bg-green-800 dark:active:bg-neutral-500 active:shadow-inner">
            <BuildingOffice2Icon className="h-8 w-8 md:h-10 md:w-10 mb-1 transform transition-transform duration-300" />
            Locais do Instituto
          </a>
          <a href="https://www.reservasifnmgsal.site" target="_blank" className="block w-full h-28 bg-green-700 dark:bg-white text-white dark:text-black text-center text-xl md:text-2xl rounded-md hover:bg-green-600 dark:hover:bg-neutral-300 transition-all duration-500 flex flex-col items-center justify-center shadow-lg hover:shadow-xl active:bg-green-800 dark:active:bg-neutral-500 active:shadow-inner">
            <ArrowPathIcon className="h-8 w-8 md:h-10 md:w-10 mb-1 transform transition-transform duration-300" />
            Reserva de Horários
          </a>
          <a href="http://agenda.ifsalinas.duckdns.org" target="_blank" className="block w-full h-28 bg-green-700 dark:bg-white text-white dark:text-black text-center text-xl md:text-2xl rounded-md hover:bg-green-600 dark:hover:bg-neutral-300 transition-all duration-500 flex flex-col items-center justify-center shadow-lg hover:shadow-xl active:bg-green-800 dark:active:bg-neutral-500 active:shadow-inner">
            <CalendarDaysIcon className="h-8 w-8 md:h-10 md:w-10 mb-1 transform transition-transform duration-300" />
            Reserva de Salas
          </a>
        </div>
      </div>
      <footer className="text-center text-black dark:text-white p-4">
        © {currentYear} IFNMG - Todos os direitos reservados.
      </footer>
      <dialog ref={dialogRef} className="font-sans bg-white border-t-4 border-orange-600 rounded-lg max-w-xs min-[420px]:max-w-sm p-5 shadow-lg backdrop:bg-black/50">
        <div className="flex flex-col items-center mb-4">
          <ExclamationTriangleIcon className="h-28 w-28 max-sm:h-20 max-sm:w-20 text-orange-600 mb-2" />
          <h2 className="font-bold text-center text-3xl max-sm:text-2xl text-black">Período trocado!</h2>
        </div>
        <p className="text-center text-lg max-sm:text-sm text-black mb-4">Verifique as informações com atenção. Ao voltar para esse menu, os horários voltarão para o período atual.</p>
        <div className="flex justify-center">
          <button className="cursor-pointer font-bold bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 transition active:bg-red-800" onClick={handleCloseDialog}>
            Fechar
          </button>
        </div>
      </dialog>
    </div>
  );
}