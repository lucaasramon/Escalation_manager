import { useProcessesContext } from '@/context/context';
import { CycleState, PreemptiveEscalationAlgorithm, ProcessState } from '@/enums';
import { ICycle } from '@/types';

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


  const getProcessesCpuUsageTotalTime = (cycle: ICycle) => {
	  return cycle.cycleProcesses.reduce((accumulator, process) => accumulator + process.cpuUsageTime , 0)
  }

  const getProcessesAverageWaitingTime = (cycle: ICycle) => {
	  return Math.round(cycle.cycleProcesses.reduce((accumulator, process) => accumulator + process.waitingTime , 0) / cycle.cycleProcesses.length)
  }

  return (
    <dialog id="modal" className="modal modal-open">
      <div className="modal-box w-full max-w-full">
        <button
          onClick={showStatistics}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
        <h1 className='text-xl font-bold text-green-500'>Estatisticas</h1>

      {cycles
      .sort((a, b) => b.id - a.id)
      .map((cycle) => (
        <div key={cycle.id} className='border border-primary rounded mb-4'>
          <div className="flex justify-between m-4">
            <span>{cycle.algorithm}</span>
            <h1 className={`text-lg font-semibold mb-2 italic ${cycle.status === CycleState.Active ? 'text-green-500' : 'text-red-500'}`}>
              {cycle.status} 
            </h1>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>PID</th>
                <th>Prioridade</th>
                <th>Tempo de Espera</th>
                <th>Utilização de CPU</th>
                <th>Tempo Necessário</th>
              </tr>
            </thead>
            <tbody>
              {cycle.cycleProcesses?.map((process, index) => (
                <tr key={index}> 
                  <th>{process.id} </th> 
                  <td>{process.priority} seg(s)</td> 
                  <td>{process.waitingTime} seg(s)</td> 
                  <td>{process.cpuUsageTime} seg(s)</td> 
                  <td>{process.runningTime} seg(s)</td> 
                </tr>
              ))}
              <tr>
                <th>Utilização total de CPU</th>
                <th>Tempo de Espera Médio</th>
                <th>Duração do ciclo</th>
              </tr>
              <tr>
                  <td>{getProcessesCpuUsageTotalTime(cycle)} seg(s)</td>
                  <td>{getProcessesAverageWaitingTime(cycle)} seg(s)</td>
                  <td>{cycle.duration} seg(s)</td>
              </tr>
            </tbody>
          </table>
        </div>
        
      ))}
      </div>
    </dialog>
  );
}
