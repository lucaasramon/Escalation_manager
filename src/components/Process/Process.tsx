'use client';
import React, { useEffect, useState } from 'react';
import CreateProcess from './components/CreateProcess';
import { IProcess } from '@/types';
import ProcessTable from './components/ProcessTable';
import { Plus, Cpu, Play, Info } from '@phosphor-icons/react';
import { EscalationAlgorithm } from '@/enums';
import SelectEscalationAlgorithm from './components/EscalationAlgorithm';
import { alternateQueuedProcessesHelper } from '@/helper/AlternateQueuedProcesses';
import { sortByFifo } from '@/helper/SortProcessses/sortByFifo';
import { sortBySjf } from '@/helper/SortProcessses/sortBySjf';
import { sortByPriority } from '@/helper/SortProcessses/sortByPriority';
import Quantum from './components/Quantum';

type cycle = {
  id: number;
  startTime: Date;
  endTime?: Date;
  algorithm: EscalationAlgorithm;
  cycleProcesses: IProcess[] | undefined;
};

export default function Process() {
  const [processes, setProcesses] = useState<IProcess[]>([]);
  const [queuedProcesses, setQueuedProcesses] = useState<IProcess[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [runningProcess, setRunningProcess] = useState<IProcess | null>(null);
  const [actualAlgorithm, setActualAlgorithm] = useState<
    EscalationAlgorithm | undefined
  >(undefined);
  const [quantum, setQuantum] = useState<number | undefined>(5);
  const [cycles, setCycles] = useState<cycle[]>([]);
  const [showStatistics, setShowStatistics] = useState<boolean>(false);

  // localStorage.setItem('processes', JSON.stringify(processes));

  //useEffect para atualizar as informações dos processos
  useEffect(() => {
    const updateProcessesInfo = () => {
      setCycles((prevCycles) => {
        return prevCycles.map((cycle) => {
          if (cycle.cycleProcesses) {
            const updatedProcesses = cycle.cycleProcesses.map((process) => {
              if (process.id === runningProcess?.id) {
                return {
                  ...process,
                  cpuUsageTime: process.cpuUsageTime + 1,
                };
              } else {
                return {
                  ...process,
                  waitingTime: process.waitingTime + 1,
                };
              }
            });

            return {
              ...cycle,
              cycleProcesses: updatedProcesses,
            };
          }
          return cycle;
        });
      });
    };

    if (runningProcess) {
      const intervalId = setInterval(updateProcessesInfo, 1000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [runningProcess, cycles]);

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
    if (actualAlgorithm === EscalationAlgorithm.RR) {
      alternateQueuedProcessesHelper(
        queuedProcesses,
        setRunningProcess,
        quantum,
      );
    } else {
      alternateQueuedProcessesHelper(queuedProcesses, setRunningProcess);
    }

    const newCycle: cycle = {
      id: cycles?.length + 1,
      algorithm: actualAlgorithm!,
      cycleProcesses: queuedProcesses,
      startTime: new Date(),
    };
    setCycles((prevState) => [...prevState, newCycle]);
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
            disabled={!processes.length || !!runningProcess}
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
                disabled={!cycles.length || !!runningProcess}
              >
                <Info size={32} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center flex-col gap-2 border-2 p-4 shadow-lg rounded-lg h-[200px] w-[200px]">
          <Cpu
            size={40}
            className={`${runningProcess ? 'animate-ping text-red-500' : ''}`}
          />

          {runningProcess && (
            <div className="flex flex-col p-4 items-center">
              <div className="flex p-2 gap-2 items-center">
                <h2 className="text-green-500 italic">Executando...</h2>
              </div>

              <div className="flex gap-1 items-center">
                <span
                  style={{ backgroundColor: runningProcess?.color }}
                  className={`rounded-full h-2 w-2 inline-block`}
                />
                <span>{runningProcess?.id}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <dialog id="my_modal_3" className="modal modal-open">
          <div className="modal-box">
            <button
              onClick={() => setShowModal(!showModal)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            <CreateProcess
              setProcesses={setProcesses}
              setShowModal={setShowModal}
              actualAlgorithm={actualAlgorithm}
            />
          </div>
        </dialog>
      )}

      {showStatistics && (
        <dialog id="my_modal_4" className="modal modal-open">
          <div className="modal-box">
            <button
              onClick={() => setShowStatistics(!showStatistics)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            <h1>Estatisticas</h1>
            <div className="p-4">
              {cycles.map((cycle) => (
                <div key={cycle.id} className="bg-gray-800 rounded-lg p-4 mb-4">
                  <h1 className="text-lg font-semibold mb-2">
                    {cycle.algorithm}
                  </h1>
                  {cycle.cycleProcesses?.map((process) => (
                    <div key={process.id} className="border-t pt-2">
                      <ul className="list-none p-0">
                        <li className="text-sm">PID: {process.id}</li>
                        <li className="text-sm">Estado: {process.state}</li>
                        <li className="text-sm">
                          Utilização de CPU: {process.cpuUsageTime} seg(s)
                        </li>
                        <li className="text-sm">
                          Tempo em espera: {process.waitingTime} seg(s)
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </dialog>
      )}

      <ProcessTable processes={processes} />
    </div>
  );
}
