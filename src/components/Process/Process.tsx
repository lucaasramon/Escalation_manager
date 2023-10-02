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
import ActionButtons from './components/ActionButtons';
import CpuComponent from './components/CpuComponent';

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

  const [sortedProcesses, setSortedProcesses] = useState<IProcess[]>([]);
  

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

  return (
    <div className="p-4 w-full grid grid-rows-2 sm:grid-cols-1 sm:grid-rows-1 gap-2 items-start md:flex-row md:items-start md:justify-between">
      <div className='flex gap-2 items-center justify-between h-full max-h-[200px]'>
        <div className="flex flex-col  h-full gap-2 items-center justify-start">
            <ProcessCreation/>
            <SelectEscalationAlgorithm/>                  
        </div>

        <div className='hidden sm:block max-w-[350px] w-full'>
          <CpuComponent/>
        </div>
          <ActionButtons/>
      </div>

      <div className='block sm:hidden'>
        <CpuComponent/>
      </div>

      <ProcessTable quantum={quantum} />
    </div>
  );
}
