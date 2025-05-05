import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

export function PlayPauseButton
    ({onClick, 
    isPlaying}: {onClick: () => void, isPlaying: boolean}){
    
    
        return(
        <button
        className={twMerge("transition ease-in flex items-center justify-center h-8 w-8 rounded-full shadow-md",
            isPlaying ? "bg-gray-700 hover: bg-pink-900" : "bg-pink-600 hover:bg-pink-800" 
        )}
        onClick={onClick}
        >
          {isPlaying ? (
            <BsFillPauseFill className="h-6 w-6" />
          ) : (
            <BsFillPlayFill className="h-6 w-6" />
          )}
          </button>
    );
}