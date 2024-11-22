import { ICycle, IProcess } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { updateActiveProcessHelper } from './updateActiveProcessHelper';
import { CycleState, ProcessState } from '@/enums';
import { shouldInitializeProcess } from './shouldInitializeProcess';

export function UpdateActiveCycleHelper(
  setActiveCycle: Dispatch<SetStateAction<ICycle | null>>,
  activeCycle: ICycle,
  activeProcess: IProcess | null,
  setActiveProcess: Dispatch<SetStateAction<IProcess | null>>
) {
  function updateActiveCycle(
    cycleState: CycleState, 
    updatedProcesses: IProcess[]
  ){
    setActiveCycle((prevCycle) => (
      prevCycle ? {
        ...prevCycle,
        duration: prevCycle.duration + 1,
        cycleProcesses: updatedProcesses,
        status: cycleState,
      } : null
    ));
  }

  if (activeCycle) {
    const updatedProcesses = activeCycle.cycleProcesses.map((process) => {
      // Inicializa os processos do ciclo ativo
      if (!process.hasArrived) {
        if (shouldInitializeProcess(process, activeCycle)) {
          process.arrivalDate = new Date();
          process.hasArrived = true;
          process.state = ProcessState.Ready;
        }
      }

      if (process.hasArrived && process.state !== ProcessState.Finished && process.isActive) {
        if(activeProcess && activeProcess.state == ProcessState.Running){
          if (activeProcess?.id === process.id) {
            if (process.cpuUsageTime >= process.runningTime) {
              return { ...process, state: ProcessState.Finished };
            } else {
              return { ...process, cpuUsageTime: process.cpuUsageTime + 1 };
            }
          } else {
            return { ...process, waitingTime: process.waitingTime + 1 };
          }
        }else{
          return process;
        }
      } else if(!process.isActive){
        return {
          ...process, state: ProcessState.Waiting
        }
      }else{
        return process;
      }
    });

    // Checa se todos os processos já finalizaram para então finalizar o ciclo
    const shouldFinishCycle = updatedProcesses.every((process) => process?.state === ProcessState.Finished);

    let cycleState = CycleState.Active;
    if (shouldFinishCycle) {
      cycleState = CycleState.Finished;
      updateActiveCycle(cycleState, updatedProcesses)
      setActiveProcess(null);
      if(activeCycle.status === CycleState.Finished){
        setActiveCycle(null)
      }
    } else {
      updateActiveCycle(cycleState, updatedProcesses)
    }
  }
}
