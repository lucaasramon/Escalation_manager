import { EscalationAlgorithm, ProcessState } from '@/enums';
import { ICycle, IProcess } from '@/types';
import { Dispatch, SetStateAction } from 'react';

export function UpdateActiveCycleHelper(
  setCycles: Dispatch<SetStateAction<ICycle[]>>,
  activeProcess: IProcess,
  activeCycle: ICycle,
  setProcesses: Dispatch<SetStateAction<IProcess[]>>,
  quantum?: number,
) {
  setCycles((prevCycles: ICycle[]) => {
    const updatedCycles = prevCycles?.map((cycle) => {
      if (cycle?.id === activeCycle?.id) {
        const updatedCycleProcesses = cycle?.cycleProcesses?.map((process) => {
          const timeLimit =
            cycle.algorithm === EscalationAlgorithm.RR
              ? quantum
              : process?.runningTime;

          if (process?.id === activeProcess?.id) {
            if (Math.ceil(process?.cpuUsageTime + 1) >= timeLimit!) {
              process.state = ProcessState.Finished;
            }

            return {
              ...process,
              cpuUsageTime: Math.ceil(process.cpuUsageTime + 1),
            };
          } else {
            return {
              ...process,
              waitingTime: Math.ceil(process.waitingTime + 1),
            };
          }
        });

        setProcesses(updatedCycleProcesses);

        return {
          ...cycle,
          cycleProcesses: updatedCycleProcesses,
        };
      } else {
        return cycle;
      }
    });

    return updatedCycles;
  });

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
