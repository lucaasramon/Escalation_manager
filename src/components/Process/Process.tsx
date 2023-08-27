'use client';
import React, { useEffect, useState } from 'react';
import CreateProcess from './components/CreateProcess';
import { ICycle, IProcess } from '@/types';
import ProcessTable from './components/ProcessTable';
import { Plus, Cpu, Play, Info, Broom } from '@phosphor-icons/react';
import { CycleState, EscalationAlgorithm, ProcessState } from '@/enums';
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
    setActiveProcess,
    setActualAlgorithm,
    setProcessesToDisplay,
    setActiveCycle,
    processes,
    setProcesses,
  } = useProcessesContext();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [quantum, setQuantum] = useState<number | undefined>(5);
  const [showStatistics, setShowStatistics] = useState<boolean>(false);

  const toggleShowStatistics = () => {
    setShowStatistics((prevShowStatistics) => !prevShowStatistics);
  };

  const wipeProcesses = () => {
    setProcesses([]);
  };

  useEffect(() => {
    const activeCycleFound: ICycle | undefined = cycles.find(
      (cycle) => cycle.id === activeCycle?.id,
    );

    setProcessesToDisplay(activeCycleFound?.cycleProcesses);
  }, [cycles, activeCycle?.id, setProcessesToDisplay]);

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
  }, [actualAlgorithm, setProcesses]);

  // useEffect para ordenar e alternar os processos na cpu
  useEffect(() => {
    if (activeCycle) {
      let sortedProcesses: IProcess[] = [];
      if (actualAlgorithm === EscalationAlgorithm.FIFO) {
        sortedProcesses = sortByFifo(activeCycle?.cycleProcesses);
      } else if (actualAlgorithm === EscalationAlgorithm.SJF) {
        sortedProcesses = sortBySjf(activeCycle?.cycleProcesses);
      } else if (actualAlgorithm === EscalationAlgorithm.Priority) {
        sortedProcesses = sortByPriority(activeCycle?.cycleProcesses);
      } else if (actualAlgorithm === EscalationAlgorithm.RR) {
        sortedProcesses = sortByFifo(activeCycle?.cycleProcesses);
      }

      alternateQueuedProcessesHelper(
        sortedProcesses,
        actualAlgorithm,
        activeCycle,
        setActiveProcess,
        setCycles,
        quantum && quantum,
      );
    }
  }, [activeCycle]);

  // useEffect para atualizar as informações dos processos do ciclo ativo
  useEffect(() => {
    if (activeCycle && activeProcess) {
      const updateActiveCycle = () => {
        UpdateActiveCycleHelper(
          setCycles,
          activeProcess,
          activeCycle,
          setProcesses,
          quantum,
        );
      };
      if (activeProcess) {
        const intervalId = setInterval(updateActiveCycle, 950);
        return () => {
          clearInterval(intervalId);
        };
      }
    }
  }, [activeProcess]);

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
      algorithm: actualAlgorithm,
      cycleProcesses: newProcesses,
      status: CycleState.Active,
    };

    console.log(newCycle);

    setActiveCycle(newCycle);
    setCycles((prevState: ICycle[]) => [...prevState, newCycle]);

    // setCycles((prevCycles: ICycle[]) => {
    //   const activeCycleFound = prevCycles?.find(
    //     (cycle) => cycle?.id === activeCycle?.id,
    //   );

    //   if (activeCycleFound) {
    //     activeCycleFound.status = CycleState.Finished;
    //   }

    //   return [...prevCycles];
    // });
  };

  return (
    <div>
      <div className="flex flex-col gap-4 items-center p-2">
        <div className="w-full flex flex-col gap-2 items-start md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row">
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(!showModal)}
              disabled={!!activeProcess}
            >
              Processo <Plus size={32} />
            </button>

            <button
              className="btn btn-primary"
              onClick={wipeProcesses}
              disabled={processes.length === 0}
            >
              Limpar <Broom size={32} />
            </button>
          </div>

          <button
            onClick={handlePlay}
            className="btn btn-primary"
            disabled={!!activeProcess}
          >
            <Play size={32} />
          </button>
        </div>

        <div className="flex gap-2 justify-between items-center w-full">
          <div className="flex flex-col gap-2 justify-start items-start">
            <SelectEscalationAlgorithm
              setActualAlgorithm={setActualAlgorithm}
            />

            {actualAlgorithm === EscalationAlgorithm.RR && (
              <Quantum setQuantum={setQuantum} quantum={quantum} />
            )}
          </div>

          {cycles && (
            <div>
              <button
                onClick={toggleShowStatistics}
                className="btn btn-primary"
                disabled={cycles.length === 0}
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
          setShowModal={setShowModal}
          showModal={showModal}
          quantum={quantum}
        />
      )}

      {showStatistics && (
        <CyclesStatistics
          cycles={cycles}
          showStatistics={toggleShowStatistics}
        />
      )}

      <ProcessTable quantum={quantum} />
    </div>
  );
}
