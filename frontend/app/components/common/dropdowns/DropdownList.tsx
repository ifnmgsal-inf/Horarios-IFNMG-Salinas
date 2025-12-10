import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface DropdownListProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  label: string;
  staticOptions?: { [key: string]: string };
}
// O Componente é a lista suspensa usada nas páginas da plataforma
export default function DropdownList({ value, onChange, options, label, staticOptions }: DropdownListProps) {
  return (
    <div className="relative mb-2">
      <select value={value} onChange={onChange} className="cursor-pointer font-sans bg-white dark:bg-black p-2 border border-neutral-500 text-black dark:text-white appearance-none w-full pl-3 pr-8">
        <option value="">
          {label}
        </option>
        {staticOptions && Object.entries(staticOptions).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
        {options.length > 0 && options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black dark:text-white pointer-events-none" />
    </div>
  );
}