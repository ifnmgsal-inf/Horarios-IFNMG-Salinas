interface TabelaSalasProps {
    rows: (string | null)[][];
}

export default function TabelaSalas({ rows }: TabelaSalasProps) {
    const renderCellContent = (content: string) => {
        const isMultipleClasses = content.includes('+');

        return (
            <span className={isMultipleClasses ? 'font-bold' : ''}>
                {content}
            </span>
        );
    };

    return (
        <table className="bg-white dark:bg-black table-auto w-full border-separate border-spacing-0 border border-neutral-500 text-xs md:text-sm text-black">
            <thead>
                <tr>
                    <th className="bg-neutral-400 border border-neutral-500 p-3 text-center w-1/6">HORÁRIO</th>
                    <th className="bg-neutral-400 border border-neutral-500 p-3 text-center w-1/6">SEGUNDA</th>
                    <th className="bg-neutral-400 border border-neutral-500 p-3 text-center w-1/6">TERÇA</th>
                    <th className="bg-neutral-400 border border-neutral-500 p-3 text-center w-1/6">QUARTA</th>
                    <th className="bg-neutral-400 border border-neutral-500 p-3 text-center w-1/6">QUINTA</th>
                    <th className="bg-neutral-400 border border-neutral-500 p-3 text-center w-1/6">SEXTA</th>
                </tr>
            </thead>
            <tbody>
                {rows.length > 0 ? (
                    rows.slice(0, rows.length - 1).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td className="bg-zinc-300 border border-neutral-500 p-3 text-center font-bold whitespace-nowrap overflow-hidden text-ellipsis w-[150px] max-w-[150px]">
                                {row[0]}
                            </td>
                            <td className="dark:text-white border border-neutral-500 p-3 text-center w-1/6">{renderCellContent(row[1] ?? '')}</td>
                            <td className="dark:text-white border border-neutral-500 p-3 text-center w-1/6">{renderCellContent(row[3] ?? '')}</td>
                            <td className="dark:text-white border border-neutral-500 p-3 text-center w-1/6">{renderCellContent(row[5] ?? '')}</td>
                            <td className="dark:text-white border border-neutral-500 p-3 text-center w-1/6">{renderCellContent(row[7] ?? '')}</td>
                            <td className="dark:text-white border border-neutral-500 p-3 text-center w-1/6">{renderCellContent(row[9] ?? '')}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6} className="dark:text-white border border-neutral-500 p-3 text-center">
                            Nenhum resultado foi encontrado.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};