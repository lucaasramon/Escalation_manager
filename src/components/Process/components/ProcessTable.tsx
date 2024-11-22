import { useProcessesContext } from '@/context/context';
import { PreemptiveEscalationAlgorithm, ProcessState } from '@/enums';
import { ICycle, IProcess } from '@/types';
import { PlayPause, XCircle } from '@phosphor-icons/react';
import React from 'react';
import { CycleState } from '@/enums';
import ProcessArrival from './ProcessArrival';
import { updateAllProcesses } from '@/helper/updateAllProcesses';

type ProcessTableProps = {
  quantum: number | undefined;
};

export default function ProcessTable({ quantum }: ProcessTableProps) {
  const { activeProcess, currentAlgorithm, processes, setProcesses, activeCycle, setCycles, setActiveCycle, setActiveProcess} =
    useProcessesContext();

  const handleDeleteProcess = (id: number) => {
    const filteredProcesses = processes.filter((process: IProcess) => process.id != id)
    setProcesses(filteredProcesses)

  }
  const toggleProcessActive = (id: number) => {
    setActiveCycle((prevCycle: ICycle) => {
      const updatedProcesses = prevCycle.cycleProcesses.map((process: IProcess) => {
        if(process.id === id){
          return {
            ...process, isActive: !process.isActive
          }
        }else{
          return process
        }
      })
      return prevCycle ? {
        ...prevCycle,
        cycleProcesses: updatedProcesses,
      } : null;
    })

    updateAllProcesses(activeCycle, setCycles ,setProcesses)

    if(id === activeProcess?.id){
      setActiveProcess(null)
    }
  }

  return (
    <div className="overflow-x-auto mt-24">
      <h1 className="text-center mb-4 text-3xl font-bold">Tabela de processos</h1>
      {processes?.length ? (
        <table className="table">
          <thead>
            <tr>
              <th>Posição</th>
              <th>PID</th>
              <th>Prioridade</th>
              {quantum && currentAlgorithm === PreemptiveEscalationAlgorithm.RR ? (
                  <th>Quantum</th>
                ) : null}
              <th>Tempo restante</th>
              <th>Tempo de execução</th>
              <th>Utilização de CPU</th>
              <th>Tempo em espera</th>
              <th>Estado</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process, index) => (
              <tr key={process?.id ? process.id : index} className={`w-full ${process.id === activeProcess?.id && 'bg-black opacity-9 font-bold'}  `}>
                <td>
                  {process.position
                   ? process.state === ProcessState.Finished ? "-" : `${process.position}º` : "-"}
                </td>
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
                {quantum && currentAlgorithm === PreemptiveEscalationAlgorithm.RR ? (
                  <td>{quantum}</td>
                ): null}
                 <td>{process?.runningTime - process?.cpuUsageTime} seg(s)</td>
                <td>{process?.runningTime} seg(s)</td>
                <td>{process?.cpuUsageTime} seg(s)</td>
                <td>{process?.waitingTime} seg(s)</td>
                <td>
                  <ProcessArrival process={process}/>
                </td>
                <td><XCircle className='cursor-pointer text-white hover:text-red-600' onClick={() => handleDeleteProcess(process.id)} size={28} /></td>
                <td>
                  <button 
                    disabled={process.state == ProcessState.Finished || activeCycle?.status !== CycleState.Active}
                    className={`cursor-pointer text-white hover:text-green-600 ${process.state === ProcessState.Finished ? "opacity-50 cursor-not-allowed hover:text-red-500" : ""}`}
                    onClick={() => toggleProcessActive(process.id)}
                    >
                      <PlayPause 
                        size={28} 
                      />
                  </button> 
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
