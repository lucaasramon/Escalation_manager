'use client';
import React, { useEffect, useState } from 'react';
import CreateProcess from './components/CreateProcess';
import { IProcess } from '@/types';
import ProcessTable from './components/ProcessTable';
import { Plus, Cpu, Play } from '@phosphor-icons/react';
import { EscalationAlgorithm, ProcessType } from '@/enums';
import SelectEscalationAlgorithm from './components/EscalationAlgorithm';
import ProcessSettings from './components/ProcessSettings';
import { alternateQueuedProcessesHelper } from '@/helper/AlternateQueuedProcesses';
import { sortByFifo } from '@/helper/SortProcessses/sortByFifo';
import { sortBySjf } from '@/helper/SortProcessses/sortBySjf';
import { sortByPriority } from '@/helper/SortProcessses/sortByPriority';

export default function Process() {
  const [processes, setProcesses] = useState<IProcess[]>([]);
  const [queuedProcesses, setQueuedProcesses] = useState<IProcess[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [runningProcess, setRunningProcess] = useState<IProcess | null>(null);
  const [actualAlgorithm, setActualAlgorithm] = useState<
    EscalationAlgorithm | undefined
  >(undefined);
  const [quantum, setQuantum] = useState<number | undefined>(5);

  console.log('runningProcess : ', runningProcess);
  console.log('queuedProcesses: ', queuedProcesses);

  localStorage.setItem('processes', JSON.stringify(processes));

  // const handleUpdateRunningProcess = () => {
  //   setProcesses((prevState) =>
  //     prevState.map((process) => {
  //       if (process.id === runningProcess?.id) {
  //         process.state = ProcessState.Running;
  //       }
  //       console.log(process);
  //       return process;
  //     }),
  //   );
  // };

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
            onClick={() =>
              alternateQueuedProcessesHelper(
                queuedProcesses,
                setRunningProcess,
                quantum,
              )
            }
            className="btn btn-primary"
          >
            <Play size={32} />
          </button>

          <SelectEscalationAlgorithm setActualAlgorithm={setActualAlgorithm} />

          {actualAlgorithm === EscalationAlgorithm.RR && (
            <ProcessSettings setQuantum={setQuantum} quantum={quantum} />
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

      <ProcessTable processes={processes} />
    </div>
  );
}
