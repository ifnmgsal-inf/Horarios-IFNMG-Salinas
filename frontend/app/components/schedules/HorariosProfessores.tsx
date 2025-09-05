import { useState, useEffect } from 'react';
import { fetchProfessorData } from '../../api/routes';
import ListaSuspensa from '../common/dropdowns/DropdownList';
import BotaoBuscar from '../common/buttons/SearchButton';
import DownloadButton from '../common/buttons/DownloadButton';
import BotaoVoltar from '../common/buttons/BackButton';
import TabelaProfessores from '../tables/TabelaProfessores';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// O componente mostra uma lista de professores, a tabela com os horários de um professor selecionado e a carga horária total, com opções de buscar, baixar e voltar
export default function HorariosProfessores() {
  const [periodoId, setPeriodoId] = useState<string>('');
  const [rows, setRows] = useState<(string | null)[][]>([]);
  const [horas, setHoras] = useState('');
  const [professores, setProfessores] = useState<string[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState('');

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
      const data = await fetchProfessorData(periodoId, selectedProfessor);
      setRows(data.rows);
      setHoras(data.horas);
    } catch (error) {
      console.error("Erro ao buscar dados dos professores:", error);
    }
  };

  useEffect(() => {
    const fetchProfessores = async () => {
      if (!periodoId) {
        return;
      }

      try {
        const data = await fetchProfessorData(periodoId, '');
        setProfessores(data.professores);
      } catch (error) {
        console.error("Erro ao buscar lista de professores:", error);
      }
    };

    fetchProfessores();
  }, [periodoId]);

  const handleProfessorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProfessor(e.target.value);
  };

  const downloadTable = () => {
    const tableElement = document.querySelector('table');

    if (!rows.length) {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Nenhum resultado foi encontrado.', 105, 80, { align: 'center' });
      pdf.save('Horário Professor.pdf');
      return;
    }
    
    if (!tableElement) {
      console.error('Tabela não encontrada.');
      return;
    }
    
    html2canvas(tableElement, { scale: 2 }).then((canvas) => {
      const pixelToMm = 0.264583;
      const imgWidth = canvas.width * pixelToMm;
      const imgHeight = canvas.height * pixelToMm;

      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [imgWidth, imgHeight]
      });

      const image = canvas.toDataURL('image/png', 1.0);

      pdf.addImage(image, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      pdf.save(`Horário Professor - ${selectedProfessor}.pdf`);
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="min-h-screen container mx-auto px-2 py-6">
        <h1 className="font-sans font-semibold text-center text-3xl mb-4 text-black dark:text-white">Selecione o Professor</h1>
        <div className="flex flex-col items-center mb-4 text-black dark:text-white">
          <ListaSuspensa
            value={selectedProfessor}
            onChange={handleProfessorChange}
            options={professores}
            label="Disciplinas (Professores)"
          />
          <div className="flex items-center space-x-4">
            <BotaoBuscar onClick={fetchData} />
            <DownloadButton onClick={downloadTable} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <TabelaProfessores rows={rows} />
        </div>
        <div className="flex flex-col items-center mt-4">
          <p className="text-center font-sans font-bold bg-neutral-500 dark:bg-white p-3 rounded-md inline-block text-white dark:text-black">
            Carga Horária - Total: {horas}
          </p>
          <div className="mt-4">
            <BotaoVoltar />
          </div>
        </div>
      </div>
    </div>
  );
}