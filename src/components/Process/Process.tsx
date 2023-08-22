'use client';
import React, { useEffect, useState } from 'react';
import CreateProcess from './components/CreateProcess';
import { ICycle, IProcess } from '@/types';
import ProcessTable from './components/ProcessTable';
import { Plus, Cpu, Play, Info } from '@phosphor-icons/react';
import { EscalationAlgorithm, ProcessState } from '@/enums';
import SelectEscalationAlgorithm from './components/EscalationAlgorithm';
import { alternateQueuedProcessesHelper } from '@/helper/alternateQueuedProcesses';
import { sortByFifo } from '@/helper/SortProcessses/sortByFifo';
import { sortBySjf } from '@/helper/SortProcessses/sortBySjf';
import { sortByPriority } from '@/helper/SortProcessses/sortByPriority';
import Quantum from './components/Quantum';
import CyclesStatistics from './components/Cycles/CyclesStatistics';
import { UpdateActiveCycleHelper } from '@/helper/updateActiveCycleHelper';
import { useProcessesContext } from '@/context/context';

export default function Process() {
  const {
    cycles,
    setCycles,
    activeCycle,
    activeProcess,
    actualAlgorithm,
    processes,
    setActiveCycle,
    setActiveProcess,
    setActualAlgorithm,
    setProcesses,
  } = useProcessesContext();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [quantum, setQuantum] = useState<number | undefined>(5);
  const [showStatistics, setShowStatistics] = useState<boolean>(false);

  const toggleShowStatistics = () => {
    setShowStatistics((prevShowStatistics) => !prevShowStatistics);
  };

  //useEffect para atualizar as informações dos processos do ciclo ativo
  useEffect(() => {
    const updateActiveCycle = () => {
      const updatedCycles = UpdateActiveCycleHelper(
        setCycles,
        activeProcess!,
        activeCycle!,
      );
    console.log(updatedCycles)

    };


    if (activeProcess) {
      const intervalId = setInterval(updateActiveCycle, 500);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [activeProcess]);

  const handlePlay = () => {
    const newCycle: ICycle = {
      id: cycles?.length + 1,
      algorithm: actualAlgorithm!,
      cycleProcesses: processes,
      startTime: new Date(),
    };
    setActiveCycle(newCycle);
    setCycles((prevState: ICycle[]) => [...prevState, newCycle]);

    let sortedProcesses: IProcess[] = [];

    if (actualAlgorithm === EscalationAlgorithm.FIFO) {
      sortedProcesses = sortByFifo(newCycle?.cycleProcesses);
    } else if (actualAlgorithm === EscalationAlgorithm.SJF) {
      sortedProcesses = sortBySjf(newCycle?.cycleProcesses);
    } else if (actualAlgorithm === EscalationAlgorithm.Priority) {
      sortedProcesses = sortByPriority(newCycle?.cycleProcesses);
    } else if (actualAlgorithm === EscalationAlgorithm.RR) {
      sortedProcesses = sortByFifo(newCycle?.cycleProcesses);
    }

    if (actualAlgorithm === EscalationAlgorithm.RR) {
      alternateQueuedProcessesHelper(
        sortedProcesses,
        setActiveProcess,
        quantum,
      );
    } else {
      alternateQueuedProcessesHelper(sortedProcesses, setActiveProcess);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 items-center p-2">
        <div className="flex items-center justify-between w-full">
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(!showModal)}
          >
            Processo <Plus size={32} />
          </button>

          <button
            onClick={handlePlay}
            className="btn btn-primary"
            disabled={!processes.length || !!activeProcess}
          >
            <Play size={32} />
          </button>
        </div>

        <div className="flex gap-2 justify-between items-center w-full">
          <SelectEscalationAlgorithm setActualAlgorithm={setActualAlgorithm} />

          {actualAlgorithm === EscalationAlgorithm.RR && (
            <Quantum setQuantum={setQuantum} quantum={quantum} />
          )}

          {cycles && (
            <div>
              <button
                onClick={toggleShowStatistics}
                className="btn btn-primary"
                disabled={!cycles.length || !!activeProcess}
              >
                <Info size={32} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center flex-col gap-2 p-4 shadow-lg rounded-lg h-[200px] w-[200px]">
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

      {showModal && (
        <CreateProcess
          setProcesses={setProcesses}
          setShowModal={setShowModal}
          actualAlgorithm={actualAlgorithm}
          showModal={showModal}
        />
      )}

      {showStatistics && (
        <CyclesStatistics
          cycles={cycles}
          showStatistics={toggleShowStatistics}
        />
      )}

      <ProcessTable processes={processes} />
    </div>
  );
}
