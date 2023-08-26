import { ProcessState } from '@/enums';
import { ICycle, IProcess } from '@/types';
import { Dispatch, SetStateAction } from 'react';

export function UpdateActiveCycleHelper(
  setCycles: Dispatch<SetStateAction<ICycle[]>>,
  activeProcess: IProcess,
  activeCycle: ICycle,
  cycles: ICycle[],
) {
  setCycles((prevCycles: ICycle[]) => {
    const updatedCycles = prevCycles?.map((cycle) => {
      console.log('activeCycle: ', activeCycle.id);
      console.log('cycle: ', cycle.id);
      console.log('cycles: ', cycles);
      if (cycle?.id === activeCycle?.id) {
        console.log('estou aqui');
        const updatedCycleProcesses = cycle?.cycleProcesses?.map((process) => {
          if (process?.id === activeProcess?.id) {
            if (Math.ceil(process?.cpuUsageTime + 1) >= process?.runningTime) {
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
}
