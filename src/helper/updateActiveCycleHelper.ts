import { CycleState, NonPreemptiveEscalationAlgorithm, PreemptiveEscalationAlgorithm, ProcessState } from '@/enums';
import { ICycle, IProcess } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { shouldUpdateIndexHelper } from './shouldUpdateIndexHelper';
import { changeActiveProcess } from './changeActiveProcessHelper';
import { updateActiveProcessHelper } from './updateActiveProcessHelper';

export function UpdateActiveCycleHelper(
  setCycles: Dispatch<SetStateAction<ICycle[]>>,
  setActiveCycle: Dispatch<SetStateAction<ICycle>>,
  activeProcess: IProcess,
  activeCycle: ICycle,
  setProcesses: Dispatch<SetStateAction<IProcess[]>>,
  setActiveProcess: Dispatch<SetStateAction<IProcess>>,
  processIndex: any,
  setProcessIndex: React.Dispatch<React.SetStateAction<number>>,
  count: number,
  setCount: React.Dispatch<React.SetStateAction<number>>,
  quantum: any, 
  sortedProcesses: IProcess[],
) {
  if(activeCycle){
    setCycles((prevCycles: ICycle[]) => {
      const updatedCycles = prevCycles?.map((cycle) => {
        if (cycle?.id === activeCycle?.id) {

          const updatedCycleProcesses: IProcess[] = updateActiveProcessHelper(
            activeProcess,
            cycle,
            activeCycle,
            setActiveProcess,
            setProcessIndex,
            count,
            setCount,
            quantum
          );

          setProcesses(updatedCycleProcesses);
          setActiveCycle((prevCycle) => ({...prevCycle, cycleProcesses: updatedCycleProcesses}))

          return {
            ...cycle,
            cycleProcesses: updatedCycleProcesses,
          };
        } 
        else {
          return cycle;
        }
      });
    return updatedCycles;
  });
}

  // setProcesses((prevProcesses: IProcess[]) => {

  //       const updatedProcesses = prevProcesses.map((process) => {
  //         const timeLimit =
  //           cycle.algorithm === EscalationAlgorithm.RR
  //             ? quantum
  //             : process?.runningTime;

  //         if (process?.id === activeProcess?.id) {
  //           if (Math.ceil(process?.cpuUsageTime + 1) >= timeLimit!) {
  //             process.state = ProcessState.Finished;
  //           }

  //           return {
  //             ...process,
  //             cpuUsageTime: Math.ceil(process.cpuUsageTime + 1),
  //           };
  //         } else {
  //           return {
  //             ...process,
  //             waitingTime: Math.ceil(process.waitingTime + 1),
  //           };
  //         }
  //       });

  //       return {
  //         ...cycle,
  //         cycleProcesses: updatedCycleProcesses,
  //       };
  //     } else {
  //       return cycle;
  //     }
  //   });

  //   return updatedCycles;
  // });
}
