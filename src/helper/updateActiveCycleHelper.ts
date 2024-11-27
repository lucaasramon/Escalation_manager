import { ICycle, IProcess } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { updateActiveProcessHelper } from './updateActiveProcessHelper';
import { CycleState, ProcessState } from '@/enums';
import { shouldInitializeProcess } from './shouldInitializeProcess';

export function UpdateActiveCycleHelper(
  setActiveCycle: Dispatch<SetStateAction<ICycle | null>>,
  activeCycle: ICycle,
  activeProcess: IProcess | null,
  setActiveProcess: Dispatch<SetStateAction<IProcess | null>>,
  quantum?: number
) {
  function updateActiveCycle(
    cycleState: CycleState,
    updatedProcesses: IProcess[]
  ) {
    setActiveCycle((prevCycle) =>
      prevCycle
        ? {
            ...prevCycle,
            duration: prevCycle.duration + 1,
            cycleProcesses: updatedProcesses,
            status: cycleState,
          }
        : null
    );
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
        if (activeProcess && activeProcess.state == ProcessState.Running) {
          if (activeProcess?.id === process.id) {
            if (quantum) {
              // Verifica se o próximo quantum já foi definido para o processo
              if (!process.nextQuantumTime) {
                process.nextQuantumTime = process.cpuUsageTime + quantum;
              }
                        
              // Verifica se o cpuUsageTime atingiu o próximo quantum
              if (process.cpuUsageTime >= process.nextQuantumTime) {
            
                // Atualiza o próximo quantum se o processo ainda não terminou
                if (process.cpuUsageTime >= process.runningTime) {
                  return { ...process, state: ProcessState.Finished, nextQuantumTime: undefined };
                } else {
                  process.nextQuantumTime = process.cpuUsageTime + quantum;
                  process.state = ProcessState.roundRobin 
                  return { ...process};
                }
              } else {
                // Incrementa o tempo de uso de CPU
                return { ...process, cpuUsageTime: process.cpuUsageTime + 1 };
              }
            } else {

              if (process.cpuUsageTime >= process.runningTime) {

                return { ...process, state: ProcessState.Finished };
              } else {
                return { ...process, cpuUsageTime: process.cpuUsageTime + 1 };
              }
            }
          } else {
            return { ...process, waitingTime: process.waitingTime + 1 };
          }
        } else {
          return {
            ...process, state: ProcessState.Ready
          };
        }
      } else if (!process.isActive) {
        console.log("3######")
        return {
          ...process, state: ProcessState.Waiting
        };
      } else if (process.isActive && process.state == ProcessState.Waiting) {
        console.log("4######")
        return {
          ...process, state: ProcessState.Ready
        };
      } else {
        return process
      }
    });

    // Checa se todos os processos já finalizaram para então finalizar o ciclo
    const shouldFinishCycle = updatedProcesses.every((process) => process?.state === ProcessState.Finished);

    let cycleState = CycleState.Active;
    if (shouldFinishCycle) {
      cycleState = CycleState.Finished;
      updateActiveCycle(cycleState, updatedProcesses);
      setActiveProcess(null);
      if (activeCycle.status === CycleState.Finished) {
        setActiveCycle(null);
      }
    } else {
      updateActiveCycle(cycleState, updatedProcesses);
    }
  }
}
