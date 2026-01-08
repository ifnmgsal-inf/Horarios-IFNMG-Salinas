interface TabelaValidacaoProps {
    rows: (string | null)[][];
    validacoes: string[];
}

export default function TabelaValidacao({ rows, validacoes }: TabelaValidacaoProps) {
    const emErros = rows.filter(row => row[0]?.toString().includes("Ensino Médio")).map(r => r[0]);
    const esErros = rows.filter(row => row[0]?.toString().includes("Graduação")).map(r => r[0]);
    const vdErros = rows.filter(row => row[0]?.toString().includes("Validação de Dados")).map(r => r[0]);

    const getResultado = (index: number) => validacoes[index] || "";

    return (
        <div>
            <table className="bg-white dark:bg-black table-auto w-full border-separate border-spacing-0 border border-neutral-500 text-xs md:text-sm text-black">
                <thead>
                    <tr>
                        <th className="bg-neutral-400 border border-neutral-500 p-3 text-center">CRITÉRIO</th>
                        <th className="bg-neutral-400 border border-neutral-500 p-3 text-center">RESULTADO</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="dark:text-white border border-neutral-500 p-3 text-left">
                            A guia que contém os horários das turmas dos cursos técnicos (<span className="font-bold">Horário - Ensino Médio</span>) foi encontrada?
                        </td>
                        <td className="dark:text-white border border-neutral-500 p-3 text-center">{getResultado(0)}</td>
                    </tr>
                    <tr>
                        <td className="dark:text-white border border-neutral-500 p-3 text-left">
                            A guia que contém os horários das turmas dos cursos superiores (<span className="font-bold">Horário - Graduação</span>) foi encontrada?
                        </td>
                        <td className="dark:text-white border border-neutral-500 p-3 text-center">{getResultado(1)}</td>
                    </tr>
                    <tr>
                        <td className="dark:text-white border border-neutral-500 p-3 text-left">
                            A guia que reúne a lista de professores da instituição (<span className="font-bold">Validação de Dados</span>) foi encontrada?
                        </td>
                        <td className="dark:text-white border border-neutral-500 p-3 text-center">{getResultado(2)}</td>
                    </tr>
                    <tr>
                        <td className="dark:text-white border border-neutral-500 p-3 text-left">
                            O intervalo (<span className="font-bold">B2:Z76</span>) existe em (<span className="font-bold">Horário - Ensino Médio</span>)?
                        </td>
                        <td className="dark:text-white border border-neutral-500 p-3 text-center">{getResultado(3)}</td>
                    </tr>
                    <tr>
                        <td className="dark:text-white border border-neutral-500 p-3 text-left">
                            O intervalo (<span className="font-bold">B2:AW106</span>) existe em (<span className="font-bold">Horário - Graduação</span>)?
                        </td>
                        <td className="dark:text-white border border-neutral-500 p-3 text-center">{getResultado(4)}</td>
                    </tr>
                    <tr>
                        <td className="dark:text-white border border-neutral-500 p-3 text-left">
                            O intervalo (<span className="font-bold">A2:A</span>) existe em (<span className="font-bold">Validação de Dados</span>)?
                        </td>
                        <td className="dark:text-white border border-neutral-500 p-3 text-center">{getResultado(5)}</td>
                    </tr>
                    <tr>
                        <td className="dark:text-white border border-neutral-500 p-3 text-left">
                            As células contém pares de parênteses, como <span className="font-bold">&quot;(...)(...)&quot;</span>, ou nenhum parêntese, se forem nomes de turmas?
                        </td>
                        <td className="dark:text-white border border-neutral-500 p-3 text-center">{getResultado(6)}</td>
                    </tr>
                </tbody>
            </table>
            {(emErros.length > 0 || esErros.length > 0 || vdErros.length > 0) && (
                <div className="mt-4 space-y-4">
                    <h3 className="text-md md:text-lg font-bold text-black dark:text-white mb-2">Células:</h3>
                    {[{ erros: emErros }, { erros: esErros }, { erros: vdErros }]
                        .filter(({ erros }) => erros.length > 0)
                        .map(({ erros }, idx) => (
                            <div key={idx} className="flex flex-wrap gap-2">
                                {erros.map((cell, index) => (
                                    <span key={index} className="bg-red-200 px-3 py-1 rounded text-sm text-red-800">
                                        {cell}
                                    </span>
                                ))}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}