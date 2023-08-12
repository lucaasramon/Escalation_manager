'use client';
import React, { useEffect, useState } from 'react';
import CreateProcess from './components/CreateProcess';
import { ICycle, IProcess } from '@/types';
import ProcessTable from './components/ProcessTable';
import { Plus, Cpu, Play, Info } from '@phosphor-icons/react';
import { EscalationAlgorithm } from '@/enums';
import SelectEscalationAlgorithm from './components/EscalationAlgorithm';
import { alternateQueuedProcessesHelper } from '@/helper/AlternateQueuedProcesses';
import { sortByFifo } from '@/helper/SortProcessses/sortByFifo';
import { sortBySjf } from '@/helper/SortProcessses/sortBySjf';
import { sortByPriority } from '@/helper/SortProcessses/sortByPriority';
import Quantum from './components/Quantum';
import CyclesStatistics from './components/Cycles/CyclesStatistics';

export default function Process() {
  const [processes, setProcesses] = useState<IProcess[]>([]);
  const [queuedProcesses, setQueuedProcesses] = useState<IProcess[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeProcess, setActiveProcess] = useState<IProcess | null>(null);
  const [actualAlgorithm, setActualAlgorithm] = useState<
    EscalationAlgorithm | undefined
  >(undefined);
  const [quantum, setQuantum] = useState<number | undefined>(5);
  const [cycles, setCycles] = useState<ICycle[]>([]);
  const [activeCycle, setActiveCycle] = useState<ICycle | undefined>(undefined);

  const [showStatistics, setShowStatistics] = useState<boolean>(false);

  // localStorage.setItem('processes', JSON.stringify(processes));

  console.log('cycles: ', cycles);

  //useEffect para atualizar as informações dos processos
  useEffect(() => {
    const updateActiveCycle = () => {
      setCycles((prevCycles) => {
        return prevCycles.map((cycle) => {
          if (cycle.id === activeCycle?.id) {
            if (cycle.cycleProcesses) {
              const updatedProcesses = cycle.cycleProcesses.map((process) => {
                if (process.id === activeProcess?.id) {
                  return {
                    ...process,
                    cpuUsageTime: process?.cpuUsageTime! + 1,
                  };
                } else {
                  return {
                    ...process,
                    waitingTime: process?.waitingTime! + 1,
                  };
                }
              });

              return {
                ...cycle,
                cycleProcesses: updatedProcesses,
              };
            }
          }
          return cycle;
        });
      });
    };

    if (activeProcess) {
      const intervalId = setInterval(updateActiveCycle, 1000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [activeProcess, activeCycle]);

  //useEffect para filtrar os processos baseado no algoritmo selecionado
  useEffect(() => {
    if (actualAlgorithm === EscalationAlgorithm.FIFO) {
      sortByFifo(processes, setQueuedProcesses);
    } else if (actualAlgorithm === EscalationAlgorithm.SJF) {
      sortBySjf(processes, setQueuedProcesses);
    } else if (actualAlgorithm === EscalationAlgorithm.Priority) {
      sortByPriority(processes, setQueuedProcesses);
    } else if (actualAlgorithm === EscalationAlgorithm.RR) {
      sortByFifo(processes, setQueuedProcesses);
    }
  }, [actualAlgorithm, processes]);

  const handlePlay = () => {
    const newCycle: ICycle = {
      id: cycles?.length + 1,
      algorithm: actualAlgorithm!,
      cycleProcesses: queuedProcesses,
      startTime: new Date(),
    };
    setActiveCycle(newCycle);
    setCycles((prevState) => [...prevState, newCycle]);

    if (actualAlgorithm === EscalationAlgorithm.RR) {
      alternateQueuedProcessesHelper(
        queuedProcesses,
        setActiveProcess,
        quantum,
      );
    } else {
      alternateQueuedProcessesHelper(queuedProcesses, setActiveProcess);
    }
  };

  return (
    <div>
      <div className="flex gap-2 items-start w-full justify-between ">
        <div className="flex gap-2 items-center justify-center">
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

          <SelectEscalationAlgorithm setActualAlgorithm={setActualAlgorithm} />

          {actualAlgorithm === EscalationAlgorithm.RR && (
            <Quantum setQuantum={setQuantum} quantum={quantum} />
          )}

          {cycles && (
            <div>
              <button
                onClick={() => setShowStatistics(!showStatistics)}
                className="btn btn-primary"
                disabled={!cycles.length || !!activeProcess}
              >
                <Info size={32} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center flex-col gap-2 border-2 p-4 shadow-lg rounded-lg h-[200px] w-[200px]">
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
          setShowStatistics={setShowStatistics}
          showStatistics={showStatistics}
        />
      )}

      <ProcessTable processes={processes} />
    </div>
  );
}
