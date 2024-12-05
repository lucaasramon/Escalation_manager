import { useProcessesContext } from '@/context/context';
import { CycleState, ProcessState } from '@/enums';
import { ICycle } from '@/types';
import { Broom, Info, Play, PlayPause } from '@phosphor-icons/react'
import React, { useState } from 'react'
import CyclesStatistics from './Cycles/CyclesStatistics';

type Props = {}

export default function ActionButtons({}: Props) {
    const {
        cycles,
        setCycles,
        activeProcess,
        currentAlgorithm,
        setActiveCycle,
        processes,
        setProcesses,
        isPreemptive,
        setProcessIndex,
        quantum,
        setIsCycleRunning,
        isCycleRunning,
        activeCycle
      } = useProcessesContext();

      const [showStatistics, setShowStatistics] = useState<boolean>(false);

      const toggleCycleRunning = () => {
        setIsCycleRunning(!isCycleRunning);
      };

      const wipeProcesses = () => {
        setProcesses([]);
      };

      const toggleShowStatistics = () => {
        setShowStatistics((prevShowStatistics) => !prevShowStatistics);
      };
    
      const handlePlay = () => {
        const newProcesses = processes.map((process) => ({
          ...process,
          cpuUsageTime: 0,
          waitingTime: 0,
          isActive: true,
          state: ProcessState.Ready,
        }));

        setProcesses(newProcesses);
    
        const newCycle: ICycle = {
          id: cycles.length + 1,
          algorithm: currentAlgorithm,
          cycleProcesses: newProcesses,
          status: CycleState.Active,
          isPreemptive: isPreemptive,
          duration: 0
        };
    
        setProcessIndex(0)
        setActiveCycle(newCycle);
        setCycles((prevState: ICycle[]) => [...prevState, newCycle]);
        setIsCycleRunning(true)
      };

  return (
    <div className='h-full flex flex-col items-start gap-2 justify-start'>
        <button
            onClick={handlePlay}
            className="btn btn-primary max-w-[50px] w-full md:max-w-[150px]"
            disabled={processes.length === 0 || !currentAlgorithm}
        >
            <Play size={28} /> 
            <h1 className='hidden md:block'>Iniciar</h1>
        </button>

        <button
            className="btn btn-primary max-w-[50px] w-full md:max-w-[150px]"
            onClick={wipeProcesses}
            disabled={processes.length === 0 || !!activeProcess}
        >
            <Broom size={28} />
            <h1 className='hidden md:block'>Limpar</h1>
        </button>

        {cycles && (
        <button
            onClick={toggleShowStatistics}
            className="btn btn-primary max-w-[50px] w-full md:max-w-[150px]" 
            disabled={cycles.length === 0}
        >
            <Info size={28} />
            <h1 className='hidden md:block'>Detalhes</h1>
        </button>
        )}

        <button
            onClick={toggleCycleRunning}
            className="btn btn-primary max-w-[50px] w-full md:max-w-[150px]" 
            disabled={!activeCycle || !activeProcess}
        >
            <PlayPause size={23} />
            <h1 className='hidden md:block'>
              {isCycleRunning ? "Pausar" : "Continuar"}
            </h1>
        </button>

        {showStatistics && (
        <CyclesStatistics
          cycles={cycles}
          showStatistics={toggleShowStatistics}
          quantum={quantum}
        />
      )}
  </div>
  )
}