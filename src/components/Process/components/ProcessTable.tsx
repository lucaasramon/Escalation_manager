import { IProcess } from '@/types';
import React from 'react';

type ProcessTableProps = {
  processes: IProcess[];
};

export default function ProcessTable({ processes }: ProcessTableProps) {
  return (
    <div className="overflow-x-auto">
      <h1 className="text-center mb-4 text-xl">Processos</h1>
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>PID</th>
            <th>Prioridade</th>
            <th>Tempo de execução</th>
            <th>Estado</th>
            <th>Tempo de cpu</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process) => (
            <tr key={process.id}>
              <th>
                <div>
                  <div className="flex items-center gap-1">
                    <span
                      style={{ backgroundColor: process.color }}
                      className={`rounded-full h-2 w-2 inline-block`}
                    />
                    <span> {process.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">
                      {process.type}
                    </span>
                  </div>
                </div>
              </th>
              <td>{process.priority}</td>
              <td>{process.runningTime} seg(s)</td>
              <td>{process.state}</td>
              <td>{process.cpuTime} seg(s)</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
