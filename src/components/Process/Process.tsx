'use client';
import React, { useEffect, useState } from 'react';
import CreateProcess from './components/CreateProcess';
import { ICycle, IProcess } from '@/types';
import ProcessTable from './components/ProcessTable';
import { Plus, Cpu, Play, Info, Broom, ArrowDown, ArrowUp } from '@phosphor-icons/react';
import { CycleState, NonPreemptiveEscalationAlgorithm, PreemptiveEscalationAlgorithm, ProcessState } from '@/enums';
import SelectEscalationAlgorithm from './components/EscalationAlgorithm';
import Quantum from './components/Quantum';
import CyclesStatistics from './components/Cycles/CyclesStatistics';
import { UpdateActiveCycleHelper } from '@/helper/updateActiveCycleHelper';
import { useProcessesContext } from '@/context/context';
import { sortProcessesHelper } from '@/helper/sortProcessesHelper';
import { changeActiveProcess } from '@/helper/changeActiveProcessHelper';
import ProcessCreation from './components/ProcessCreation';

export default function Process() {
  const {
    cycles,
    setCycles,
    activeCycle,
    activeProcess,
    currentAlgorithm,
    setActiveProcess,
    setActiveCycle,
    processes,
    setProcesses,
    isPreemptive,
    count,
    setCount,
    processIndex, 
    setProcessIndex,
    quantum,
    setQuantum,
  } = useProcessesContext();

  const [showStatistics, setShowStatistics] = useState<boolean>(false);
  const [sortedProcesses, setSortedProcesses] = useState<IProcess[]>([]);
  
  const toggleShowStatistics = () => {
    setShowStatistics((prevShowStatistics) => !prevShowStatistics);
  };

  const wipeProcesses = () => {
    setProcesses([]);
  };

  // useEffect resetar as informações da tabela quando o EscalationAlgorithm for trocado
  useEffect(() => {
    setProcesses((prevProcesses: IProcess[]) =>
      prevProcesses.map((process) => {
        return {
          ...process,
          cpuUsageTime: 0,
          waitingTime: 0,
          state: ProcessState.Ready,
        };
      }),
    );
  }, [currentAlgorithm]);

  // useEffect para atualizar as informações dos processos do ciclo ativo
  useEffect(() => {
    if (activeCycle && activeProcess) {
      const intervalId = setInterval(() => {

        UpdateActiveCycleHelper(
          setCycles,
          setActiveCycle,
          activeProcess,
          activeCycle,
          setProcesses,
          setActiveProcess,
          processIndex,
          setProcessIndex,
          count,
          setCount,
          quantum,
          sortedProcesses,
        );

      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [activeProcess]);

  // useEffect para ordenar e alternar os processos na cpu
  useEffect(() => {

    if (activeCycle?.status === CycleState.Active) {
      let sortedProcesses = sortProcessesHelper(currentAlgorithm, activeCycle)
      setSortedProcesses(sortedProcesses)
      changeActiveProcess(
        activeProcess,
        processIndex, 
        setActiveProcess, 
        sortedProcesses, 
        currentAlgorithm,
        setProcessIndex,
        activeCycle,
        setCycles,
        setActiveCycle
      );
    }
  }, [activeCycle, activeCycle?.cycleProcesses, processIndex]);

  const handlePlay = () => {
    const newProcesses = processes.map((process) => ({
      ...process,
      cpuUsageTime: 0,
      waitingTime: 0,
      state: ProcessState.Ready,
    }));

    setProcesses(newProcesses);

    const newCycle: ICycle = {
      id: cycles.length + 1,
      algorithm: currentAlgorithm,
      cycleProcesses: newProcesses,
      status: CycleState.Active,
      isPreemptive: isPreemptive
    };

    setProcessIndex(0)
    setActiveCycle(newCycle);
    setCycles((prevState: ICycle[]) => [...prevState, newCycle]);
  };

  return (
    <div>
      <div className="grid grid-cols-1 grid-rows-2 flex-col gap-8 items-center p-2 md:flex">
        <div className="w-full grid grid-cols-2 gap-2 items-start md:flex-row md:items-start md:justify-between p-2">
          <div className='flex flex-col gap-2 items-center w-full h-full'>
            <ProcessCreation/>
            <div className="flex gap-2 items-center justify-center relative">
                <div className="flex flex-col gap-2 justify-start items-start max-w-[150px]">
                  <SelectEscalationAlgorithm/>

                  <div className='absolute bottom-[-250px]'>
                    {currentAlgorithm === PreemptiveEscalationAlgorithm.RR && isPreemptive && (
                      <Quantum setQuantum={setQuantum} quantum={quantum} />
                    )}
                  </div>
                  
                </div>
            </div>
          </div>

          <div className='h-full flex flex-col items-center gap-2 justify-center'>
            <button
              onClick={handlePlay}
              className="btn btn-primary max-w-[150px] w-full"
              disabled={processes.length === 0}
            >
              Iniciar <Play size={28} />
            </button>

            <button
                className="btn btn-primary max-w-[150px] w-full"
                onClick={wipeProcesses}
                disabled={processes.length === 0 || !!activeProcess}
              >
                Limpar <Broom size={28} />
              </button>

            {cycles && (
              <button
                onClick={toggleShowStatistics}
                className="btn btn-primary max-w-[150px] w-full" 
                disabled={cycles.length === 0}
              >
                Detalhes<Info size={28} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center flex-col gap-2 p-4 shadow-lg rounded-lg h-[200px] w-full">
          <Cpu
            size={40}
            className={`${activeProcess ? 'animate-ping text-red-500' : ''}`}
          />

          {activeProcess && (
            <div className="flex flex-col p-4 items-center">
              <div className="flex p-2 gap-2 items-center">
                <h2 className="text-green-500 italic">Executando...</h2>
              </div>

              <div className="flex gap-1 items-center">
                <span
                  style={{ backgroundColor: activeProcess?.color }}
                  className={`rounded-full h-2 w-2 inline-block`}
                />
                <span>{activeProcess?.id}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {showStatistics && (
        <CyclesStatistics
          cycles={cycles}
          showStatistics={toggleShowStatistics}
          quantum={quantum}
        />
      )}

      <ProcessTable quantum={quantum} />
    </div>
  );
}
