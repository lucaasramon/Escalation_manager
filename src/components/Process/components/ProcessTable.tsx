import { useProcessesContext } from '@/context/context';
import { PreemptiveEscalationAlgorithm, ProcessState } from '@/enums';
import { ICycle, IProcess } from '@/types';
import React from 'react';

type ProcessTableProps = {
  quantum: number | undefined;
};

export default function ProcessTable({ quantum }: ProcessTableProps) {
  const { activeProcess, currentAlgorithm, processes, activeCycle } =
    useProcessesContext();

  return (
    <div className="overflow-x-auto mt-24">
      <h1 className="text-center mb-4 text-3xl font-bold">Tabela de processos</h1>
      {processes?.length ? (
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>PID</th>
              <th>Prioridade</th>
              <th>Tempo de execução</th>
              <th>Utilização de CPU</th>
              <th>Tempo em espera</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process, index) => (
              <tr key={process?.id ? process.id : index} className={`w-full `}>
                <td>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        style={{ backgroundColor: process?.color }}
                        className={`rounded-full h-2 w-2 inline-block ${
                          activeProcess?.id === process?.id && 'animate-ping '
                        }`}
                      />
                      <span> {process?.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">
                        {process?.type}
                      </span>
                    </div>
                  </div>
                </td>
                <td>{process?.priority}</td>
                <td>
                  {currentAlgorithm === PreemptiveEscalationAlgorithm.RR && quantum
                    ? quantum
                    : process?.runningTime}
                  seg(s)
                </td>
                <td>{process?.cpuUsageTime} seg(s)</td>
                <td>{process?.waitingTime} seg(s)</td>
                <td
                  className={`
                  ${
                    process?.state === ProcessState.Ready
                      ? 'text-blue-500'
                      : process?.state === ProcessState.Running
                      ? 'text-green-500'
                      : process?.state === ProcessState.Finished
                      ? 'text-red-500'
                      : 'text-gray-500'
                  } 
                  `}
                >
                  {process?.state}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className='text-lg text-center'>Sem processos ainda... 🙁</p>
      )}
    </div>
  );
}
