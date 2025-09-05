import { useState, useEffect } from 'react';
import { fetchSalaData } from '../../api/routes';
import { OptionsSalas } from '../../constants/salas';
import ListaSuspensa from '../common/dropdowns/DropdownList';
import BotaoBuscar from '../common/buttons/SearchButton';
import DownloadButton from '../common/buttons/DownloadButton';
import BotaoVoltar from '../common/buttons/BackButton';
import TabelaSalas from '../tables/TabelaSalas';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// O componente mostra uma lista de salas e a tabela com os horários de ocupação de uma sala selecionada, com opções de buscar, baixar e voltar
export default function HorariosSalas() {
  const [periodoId, setPeriodoId] = useState<string>('');
  const [rows, setRows] = useState<(string | null)[][]>([]);
  const [selectedSala, setselectedSala] = useState('');

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
      const data = await fetchSalaData(periodoId, selectedSala);
      setRows(data.rows);
    } catch (error) {
      console.error("Erro ao buscar dados das salas:", error);
    }
  };

  const handleSalaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setselectedSala(e.target.value);
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
      pdf.save('Horário Sala.pdf');
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
      pdf.save(`Horário Sala - ${selectedSala}.pdf`);
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="min-h-screen container mx-auto px-2 py-6">
        <h1 className="font-sans font-semibold text-center text-3xl mb-4 text-black dark:text-white">Selecione a Sala</h1>
        <div className="flex flex-col items-center mb-4 text-black dark:text-white">
          <ListaSuspensa
            value={selectedSala}
            onChange={handleSalaChange}
            options={OptionsSalas}
            label="Turmas (Salas)"
          />
          <div className="flex items-center space-x-4">
            <BotaoBuscar onClick={fetchData} />
            <DownloadButton onClick={downloadTable} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <TabelaSalas rows={rows} />
        </div>
        <div className="flex justify-center mt-4">
          <BotaoVoltar />
        </div>
      </div>
    </div>
  );
}