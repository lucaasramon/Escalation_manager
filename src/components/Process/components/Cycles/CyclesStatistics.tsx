import { useProcessesContext } from '@/context/context';
import { CycleState, PreemptiveEscalationAlgorithm, ProcessState } from '@/enums';
import { ICycle } from '@/types';
import React from 'react';

type CyclesStatisticsProps = {
  showStatistics: () => void;
  cycles: ICycle[];
  quantum: number | undefined;
};

export default function CyclesStatistics({
  showStatistics,
  cycles,
  quantum
}: CyclesStatisticsProps) {

  return (
    <dialog id="modal" className="modal modal-open">
      <div className="modal-box">
        <button
          onClick={showStatistics}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
        <h1 className='text-xl font-bold text-green-500'>Estatisticas</h1>
        <div className="p-4 text-white">
          {cycles?.map((cycle) => (
            <div key={cycle.id} className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="flex gap-2 w-full justify-between">
                <div className='flex flex-col items-center justify-center mb-2'>
                  <h1 className="text-lg font-semibold">
                    {cycle.algorithm}
                  </h1>
                  <span className='text-blue-500 text-sm'>{cycle.isPreemptive ? "Preemptivo" : "Não preemptivo"}</span>
                  {cycle.algorithm === PreemptiveEscalationAlgorithm.RR && (
                      <div className="text-sm text-blue-500 flex gap-1 items-center">
                      Quantum <p className='text-semibold'>{quantum} seg(s)</p>
                    </div>
                    )}                
                </div>
                
                <h1 className={`text-lg font-semibold mb-2 italic ${cycle.status === CycleState.Active ? 'text-green-500' : 'text-red-500'}`}>
                  {cycle.status} 
                </h1>
              </div>

              {cycle.cycleProcesses?.map((process) => (
                <div key={process?.id} className="border-b p-2">
                  <ul className="list-none p-0">
                    <li className="text-sm">
                      PID:{' '}
                      <span
                        style={{ backgroundColor: process?.color }}
                        className={`rounded-full h-2 w-2 inline-block`}
                      />{' '}
                      {process?.id}
                    </li>
                    <li className="text-sm">
                      Prioridade: {process?.priority}
                    </li>
                  
                    <li className={`text-sm flex gap-1 items-center`}>Estado: <p className={`text-sm  font-normal ${process.state === ProcessState.Ready ? 'text-blue-500' : process.state === ProcessState.Running ? 'text-green-500 font-bold' : 'text-red-500'}`}>
                     {process?.state} </p> </li>
                    <li className="text-sm">
                      Utilização de CPU: {process?.cpuUsageTime} seg(s)
                    </li>
                    <li className="text-sm">
                      Tempo em espera: {process?.waitingTime} seg(s)
                    </li>
                    <li className="text-sm">
                      Tempo necessário: {process?.runningTime} seg(s)
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </dialog>
  );
}
