
import {useCallback, useEffect, useRef, useState} from "react";
import { COLS, createEmptyGrid, DIRECTIONS, ROWS } from "./utils/utils";
import { twMerge } from "tailwind-merge";
import { PlayPauseButton } from "./components/PlayPauseButton";
import { Button } from "./components/Button";
import { Select } from "./components/Select";

function App() {

const [grid, setGrid]= useState<number[][]>(createEmptyGrid());
const [isPlaying, setIsPlaying]= useState(false);
const [isMouseDown, setIsMouseDown] = useState(false);
const [speed, setSpeed] = useState(100); /* 100ms */

const getGridSize = () =>{
  const size = Math.min(
    (window.innerWidth - 50) / COLS,
    (window.innerHeight - 150) / ROWS,
    30
  )
  return size
}
const [cellSize,setCellSize]= useState(getGridSize());

useEffect(()=> {
  const handleResize = ()=>{
    setCellSize(getGridSize());
  }
window.addEventListener('resize', handleResize);

return()=>{

  window.removeEventListener('resize', handleResize);
}
}, )

const speedRef = useRef(speed);
speedRef.current = speed;

const playingRef= useRef(isPlaying);
playingRef.current= isPlaying;

const runGameOfLife = useCallback(()=>{
  if(!playingRef.current){
    return;       /* Pausing the algo */
  }
  
  setGrid((currentGrid)=>{
    const newGrid = currentGrid.map((arr)=> [...arr]);    /* Creating a Deep copy of the og grid and ensuring that
                                                          modifications of the new grid does not affect og grid's data  */
    for (let row=0; row < ROWS; row++) {
      for(let col=0; col < COLS; col++) {
        let liveNeighbours = 0;


        DIRECTIONS.forEach(([directionX, directionY])=>{
          const neighbourRow = row + directionX;
          const neighbourCol = col + directionY;

          if(
            neighbourRow >=0 &&
            neighbourRow <ROWS &&
            neighbourCol >=0 &&
            neighbourCol <COLS
          ){
            liveNeighbours += currentGrid[neighbourRow] [neighbourCol] ? 1 : 0;  /* if this evaluates to 1 then Add 1 to liveneigbours otherwise 0 */
          }
        })

        /* Conway's Game of Life Rules */

        if(liveNeighbours<2 || liveNeighbours > 3){
          newGrid [row][col] = 0;       /* Rule 1) Any live cell with fewer than two live neighbours dies, as if by underpopulation. */
          
        }
          else if(currentGrid[row][col]===0 && liveNeighbours === 3){
            newGrid[row][col] = 1;      /* Rule 2) Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction. */
          }
      }
    }
    return newGrid;
  });

  setTimeout(runGameOfLife, speedRef.current);
}, [playingRef, setGrid])


const handleMouseDown = () =>{
  setIsMouseDown(true);
}

const handleMouseUp = () =>{
  setIsMouseDown(false);
}

const toggleCellState = (rowToToggle: number, colToToggle: number)=>{
  const newGrid = grid.map((row, rowIndex)=>    /* ensures immutability (avoiding direct modifications to the grid state itself)
                                                    Cruicial in react for proper Re-rendering and maintaining predictable state management */
  row.map((cell,colIndex)=>
  rowIndex === rowToToggle && colIndex === colToToggle ?  ( cell ? 0:1) : cell
  ))
  setGrid(newGrid);
}

const handleMouseEnter =(row: number, col: number) =>{
  if (isMouseDown){   
    toggleCellState(row, col) 
   }
  }

  return (
    <div className='h-screen w-screen flex items-center p-4 flex-col gap-4 relative'>
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(135%_150%_at_50%_50%,#100_40%,#83e_100%)] "></div>  
      <h1 className="md:text-4xl text-xl font-bold bg-inherit px-3 rounded-md relative group -space-x-72">
  <span
    className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400/75 to-[#210721] 
              bg-[length:200%] bg-[position:0%_50%] 
              hover:bg-[position:100%_50%]
              cursor-pointer transition-all ease-in-out duration-500"
  >
       Conway's
  </span>{" "}
  Game of Life
  <p
    className="font-mono absolute top-1 right-1/2 -translate-x-1/2 mt-1 px-4  py-4 text-xs bg-[#56244d] text-white rounded-xl invisible group-hover:visible -transition ease-in-out duration-300"         /* * group-hover:opacity-100 transition-opacity duration-300 * */
  > 
    A cellular automaton devised by <span className="bg-gradient-to-r from-pink-400/75 to-[#7e007e] px-1 rounded-sm">John Conway </span>.

    The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, live or dead (or populated and unpopulated, respectively). 
    Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. 
    At each step in time, the following transitions occur: <br/>
    <br/>
    Any live cell with fewer than two live neighbours dies, as if by underpopulation. <br/>
    Any live cell with two or three live neighbours lives on to the next generation. <br/>
    Any live cell with more than three live neighbours dies, as if by overpopulation. <br/>
    Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction. <br/>
  </p>
</h1>
        
      <div className="flex gap-4 items-center">
        <PlayPauseButton 
        isPlaying= {isPlaying}
          onClick={() =>{
            setIsPlaying (!isPlaying);
            if(!isPlaying){
              playingRef.current = true;
              runGameOfLife();
            }
          }}
        />

          <Button
            onClick={() => {
              const rows = []
              for(let i = 0 ; i<ROWS; i++){
                rows.push(Array.from(Array(COLS), ()=> (Math.random() > 0.75 ? 1 : 0 )))
              }

              setGrid(rows)
            }}
          >

            Randomize
           </Button>

           <Button 
           onClick={()=> {
            setGrid(createEmptyGrid());
            setIsPlaying(false);
           }}>
            Clear
           </Button>
      
           <Select
          label="speed selector"
          value={speed}
          onChange={(e) => setSpeed(parseInt(e.target.value))}
        >
          <option value={1000}>Very-Slow</option>  /* 1000 = 1 Sec */
          <option value={500}>Slow</option>
          <option value={250}>Medium</option>
          <option value={100}>Fast</option>
          <option value={50}>FastBoi</option>
        </Select>
      </div>
      <div

        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${cellSize}px)`,
        }}
      >
      {grid.map((rows, originalRowIndex)=>
        rows.map((_col, originalColIndex)=>(
          <button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseEnter={()=> {
              handleMouseEnter(originalRowIndex, originalColIndex);
            }}
            onClick={()=> {
              toggleCellState(originalRowIndex, originalColIndex);
            }}

          key={`${originalRowIndex}-${originalColIndex}`}
          className={twMerge("border border-[radial-gradient(135%_150%_at_50%_50%,#100_40%,#83e_100%] rounded-md",
            grid[originalRowIndex] [originalColIndex] 
              ? "bg-[#ffffff] transition ease-in border border-[#a64a95]" 
              : "bg-[#110000]"
          )}/>

        ))
      )}
    
      </div>
    </div>
  )
}

export default App
