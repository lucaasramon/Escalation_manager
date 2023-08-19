import { ICycle } from '@/types';
import React from 'react';

type CyclesStatisticsProps = {
  setShowStatistics: React.Dispatch<React.SetStateAction<boolean>>;
  showStatistics: boolean;
  cycles: ICycle[];
};

export default function CyclesStatistics({
  setShowStatistics,
  showStatistics,
  cycles,
}: CyclesStatisticsProps) {
  return (
    <dialog id="my_modal_4" className="modal modal-open">
      <div className="modal-box">
        <button
          onClick={() => setShowStatistics(!showStatistics)}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
        <h1>Estatisticas</h1>
        <div className="p-4 text-white">
          {cycles.map((cycle) => (
            <div key={cycle.id} className="bg-gray-800 rounded-lg p-4 mb-4">
              <h1 className="text-lg font-semibold mb-2">{cycle.algorithm}</h1>
              {cycle.cycleProcesses?.map((process) => (
                <div key={process.id} className="border-b p-2">
                  <ul className="list-none p-0">
                    <li className="text-sm">
                      PID:{' '}
                      <span
                        style={{ backgroundColor: process.color }}
                        className={`rounded-full h-2 w-2 inline-block`}
                      />{' '}
                      {process.id}
                    </li>
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
  );
}
