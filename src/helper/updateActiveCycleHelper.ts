import { ProcessState } from '@/enums';
import { ICycle, IProcess } from '@/types';
import { Dispatch, SetStateAction } from 'react';

function updateWaitingTimes(
  elapsedSeconds: number,
  setCycles: Dispatch<SetStateAction<ICycle[]>>,
  activeCycle: ICycle,
  id: number,
) {
  setCycles((prevCycles: ICycle[]) => {
    const updatedCycles = prevCycles?.map((cycle) => {
      if (cycle?.id === activeCycle?.id) {
        const updatedCycleProcesses = cycle?.cycleProcesses?.map((process) => {
          if (process?.id !== id) {
            return {
              ...process,
              waitingTime: elapsedSeconds,
            };
          }
          return process;
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

export function UpdateActiveCycleHelper(
  setCycles: Dispatch<SetStateAction<ICycle[]>>,
  activeProcess: IProcess,
  activeCycle: ICycle,
  totalWaitingTime: any, 
  setTotalWaitingTime: any
) {


  setCycles((prevCycles: ICycle[]) => {
    const updatedCycles = prevCycles?.map((cycle) => {
    console.log(cycle.id)

      if (cycle?.id === activeCycle?.id) {
        const updatedCycleProcesses = cycle?.cycleProcesses?.map((process) => {
          let elapsedMilliseconds = 0;
          let elapsedSeconds = 0;
          if (process?.id === activeProcess?.id) {
            elapsedMilliseconds = Date.now() - process.startTime!;
            elapsedSeconds = Math.ceil(elapsedMilliseconds / 1000);

            updateWaitingTimes(
              elapsedSeconds,
              setCycles,
              activeCycle,
              process.id,
            );

            if (process?.cpuUsageTime >= process?.runningTime) {
              return {
                ...process,
                state: ProcessState.Finished,
              };
            }

            return {
              ...process,
              cpuUsageTime: elapsedSeconds,
            };

          }

          return process;
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
