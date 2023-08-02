'use client';
import React, { useState } from 'react';
import CreateProcess from './components/CreateProcess';
import { IProcess } from '@/types';
import ProcessTable from './components/ProcessTable';
import { Plus, Cpu, Play } from '@phosphor-icons/react';
import { EscalationAlgorithm } from '@/enums';
import SelectEscalationAlgorithm from './components/EscalationAlgorithm';

type Props = {};

export default function Process({}: Props) {
  const [processes, setProcesses] = useState<IProcess[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [runningProcess, setRunningProcess] = useState<IProcess | null>(null);
  const [actualAlgorithm, setActualAlgorithm] = useState<
    EscalationAlgorithm | undefined
  >(undefined);

  const handleDefineActualProcess = () => {
    const actualProcess = processes[0];
    setRunningProcess(actualProcess);
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
            onClick={handleDefineActualProcess}
            className="btn btn-primary"
          >
            <Play size={32} />
          </button>

          <SelectEscalationAlgorithm setActualAlgorithm={setActualAlgorithm} />
        </div>

        <div className="flex items-center flex-col gap-2 border-2 p-4 shadow-lg rounded-lg h-[200px] w-[200px]">
          <Cpu size={32} />

          {runningProcess && (
            <div className="flex flex-col p-4 items-center">
              <h2>Executando</h2>
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
            <CreateProcess setProcesses={setProcesses} />
          </div>
        </dialog>
      )}

      <ProcessTable processes={processes} />
    </div>
  );
}
