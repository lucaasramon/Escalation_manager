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
            <th>Estado</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process) => (
            <tr key={process.id}>
              <th>{process.id}</th>
              <td>{process.priority}</td>
              <td>{process.state}</td>
              <td>{process.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
