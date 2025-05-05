

export function Button({
    onClick,
    children,
}:{
    onClick:() => void;
    children: React.ReactNode;
}) {
    return(
        <button 
            onClick={onClick}
            className="transition ease-in flex items-center justify-center h-8 px-4 rounded-full shawdow-md bg-[#a64a95] hover:bg-[#502348]"
            >
                {children}
            </button>
    );
} 