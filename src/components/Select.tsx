export function Select({
    value,
    onChange,
    children,
    label,
  }: {
    value: number;
    label: string;
    onChange: (value: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode;
  }) {
    return (
      <label className="cursor-pointer group transition flex items-center 
      justify-center ease-in bg-[#a64a95] h-8 hover:bg-[#502348] 
      rounded-full px-2 shadow-md disabled:opacity-50">
        <select
          className="bg-[#a64a95] cursor-pointer group-hover:bg-[#502348] ease-in transition"
          aria-label={label}
          value={value}
          onChange={onChange}
        >
          {children}
        </select>
      </label>
    );
  }