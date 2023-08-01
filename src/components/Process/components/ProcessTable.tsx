import { IProcess } from '@/types';
import React from 'react';

type ProcessTableProps = {
  processes: IProcess[];
};

export default function ProcessTable({ processes }: ProcessTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Id</th>
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
              <td>{process.type.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
