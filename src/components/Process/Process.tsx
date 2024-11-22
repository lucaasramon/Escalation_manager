'use client';
import React, { useEffect, useState } from 'react';
import { IProcess } from '@/types';
import ProcessTable from './components/ProcessTable';
import { CycleState, ProcessState } from '@/enums';
import SelectEscalationAlgorithm from './components/EscalationAlgorithm';
import { UpdateActiveCycleHelper } from '@/helper/updateActiveCycleHelper';
import { useProcessesContext } from '@/context/context';
import { sortProcessesHelper } from '@/helper/sortProcessesHelper';
import { changeOrInitializeActiveProcess } from '@/helper/changeActiveProcessHelper';
import ProcessCreation from './components/ProcessCreation';
import ActionButtons from './components/ActionButtons';
import CpuComponent from './components/CpuComponent';
import { updateActiveProcessHelper } from '@/helper/updateActiveProcessHelper';
import { updateAllProcesses } from '@/helper/updateAllProcesses';

export default function Process() {
  const {
    setCycles,
    activeCycle,
    activeProcess,
    currentAlgorithm,
    setActiveProcess,
    setActiveCycle,
    setProcesses,
    count,
    setCount,
    processIndex, 
    setProcessIndex,
    quantum,
    setQuantum,
    isCycleRunning,
    processes,
    cycles,
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
    setQuantum(0)
  }, [currentAlgorithm]);

  // useEffect para atualizar as informações do ciclo ativo, do processo ativo e dos processos
  useEffect(() => {
    if (activeCycle && isCycleRunning) {
      const intervalId = setInterval(() => {

        //atualizar informações do ciclo ativo (duração, status, tempo dos processos)
        UpdateActiveCycleHelper(
          setActiveCycle,
          activeCycle,
          activeProcess,
          setActiveProcess
        );

        //atualiza o processo ativo
        updateActiveProcessHelper(
          setActiveProcess,
        );

        //atualiza os processos (estado de process, estado de cycles)
        updateAllProcesses(
          activeCycle,
          setCycles,
          setProcesses
        )
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [activeCycle, activeProcess]);

  // useEffect para ordenar e alternar os processos na cpu
  useEffect(() => {
    if (activeCycle?.status === CycleState.Active) {
      let sortedProcesses = sortProcessesHelper(currentAlgorithm, activeCycle)

      if(
        (!activeCycle.isPreemptive && (sortedProcesses.length > 0 && !activeProcess) || (activeProcess?.state === ProcessState.Finished))
        || activeCycle.isPreemptive
      ){
        changeOrInitializeActiveProcess(
          processIndex,
          setActiveProcess,
          sortedProcesses,
          setProcessIndex,
        );
      }
    }
  }, [activeCycle, activeCycle?.cycleProcesses, activeProcess]);

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
