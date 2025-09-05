import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchCourseData } from '../../api/routes';
import { OptionsEnsinoMedio, OptionsEnsinoSuperior } from '../../constants/cursos';
import { XCircleIcon } from '@heroicons/react/24/outline';
import ListaSuspensa from '../common/dropdowns/DropdownList';
import BotaoBuscar from '../common/buttons/SearchButton';
import DownloadButton from '../common/buttons/DownloadButton';
import BotaoVoltar from '../common/buttons/BackButton';
import TabelaCursos from '../tables/TabelaCursos';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// O componente mostra uma lista de cursos e a tabela com os horários de um curso selecionado, com opções de buscar, baixar e voltar
export default function HorariosCursos() {
  const [periodoId, setPeriodoId] = useState<string>('');
  const searchParams = useSearchParams();
  const tipo = searchParams.get('tipo') ?? '';
  const [rows, setRows] = useState<(string | null)[][]>([]);
  const [maxColumns, setMaxColumns] = useState(0);
  const [courseName, setCourseName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('todos');
  const [hasSearched, setHasSearched] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPeriodoId = localStorage.getItem('periodoId');
      if (savedPeriodoId) {
        setPeriodoId(savedPeriodoId);
      }
    }
  }, []);

  const fetchData = async () => {
    if (!periodoId) {
      return;
    }

    try {
      const data = await fetchCourseData(periodoId, selectedCourse, tipo);
      setRows(data.rows);
      setMaxColumns(data.maxColumns);
      setCourseName(data.courseName);
      setHasSearched(true);
    } catch (error) {
      console.error("Erro ao buscar dados dos cursos:", error);
    }
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(e.target.value);
  };

  const courseOptions = tipo === 'ensinoMedio' ? OptionsEnsinoMedio : OptionsEnsinoSuperior;

  const emptyColumns: number[] = [];

  rows.forEach((row, rowIndex) => {
    const isFirstLineAfterDay = rowIndex > 0 && rows[rowIndex - 1].length === 1;

    if (isFirstLineAfterDay) {
      row.forEach((cell, colIndex: number) => {
        if (!cell && !emptyColumns.includes(colIndex)) {
          emptyColumns.push(colIndex);
        }
      });
    }
  });

  const downloadTable = () => {
    const tableElement = document.querySelector('table');
    // Impede o download do pdf quando o usuário selecionar todos de Ensino Superior
    // Pois dar problema na renderização do PDF (PDF Gigante)
    if (courseName === "Todos os Cursos - Ensino Superior") {
      dialogRef.current?.showModal();
      return;
    }

    if (!rows.length) {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Nenhum resultado foi encontrado.', 105, 80, { align: 'center' });
      pdf.save('Horário Curso.pdf');
      return;
    }

    if (!tableElement) {
      console.error('Tabela não encontrada.');
      return;
    }

    html2canvas(tableElement, { scale: 1.5 }).then((canvas) => {
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const pixelToMm = 0.264583;
      const pdfWidth = imgWidth * pixelToMm;
      const pdfHeight = imgHeight * pixelToMm;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });

      const image = canvas.toDataURL('image/png', 0.75);

      pdf.addImage(image, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`Horário Curso - ${courseName}.pdf`);
    });
  };

  const handleCloseDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="min-h-screen container mx-auto px-2 py-6">
        <h1 className="font-sans font-semibold text-center text-3xl mb-4 text-black dark:text-white">Selecione o Curso</h1>
        <div className="flex flex-col items-center mb-4 text-black dark:text-white">
          <ListaSuspensa
            value={selectedCourse}
            onChange={handleCourseChange}
            options={[]}
            label="Todos (Cursos)"
            staticOptions={courseOptions}
          />
          <div className="flex items-center space-x-4">
            <BotaoBuscar onClick={fetchData} />
            <DownloadButton onClick={downloadTable} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <TabelaCursos rows={rows} maxColumns={maxColumns} courseName={courseName} loading={!hasSearched} />
        </div>
        <div className="flex justify-center mt-4">
          <BotaoVoltar />
        </div>
        <dialog ref={dialogRef} className="font-sans bg-white border-t-4 border-red-500 rounded-lg max-w-xs min-[420px]:max-w-sm p-5 shadow-lg backdrop:bg-black/50">
          <div className="flex flex-col items-center mb-4">
            <XCircleIcon className="h-28 w-28 max-sm:h-20 w-20 text-red-500 mb-2" />
            <h2 className="font-bold text-center text-3xl max-sm:text-2xl text-black">Ops!</h2>
          </div>
          <p className="text-center text-lg max-sm:text-sm text-black">Não é possível fazer o download do PDF.</p>
          <p className="text-center text-lg max-sm:text-sm text-black mb-4">Pois, a tabela é muito grande!</p>
          <div className="flex justify-center">
            <button className="cursor-pointer font-bold bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 transition active:bg-red-800" onClick={handleCloseDialog}>Fechar</button>
          </div>
        </dialog>
      </div>
    </div>
  );
}