import { ProcessState } from '@/enums';
import { ICycle, IProcess } from '@/types';

export function UpdateActualCycleHelper(
  setCycles: React.Dispatch<React.SetStateAction<ICycle[]>>,
  activeProcess: IProcess,
  activeCycle: ICycle,
) {
  setCycles((prevCycles: ICycle[]) => {
    const updatedCycles = prevCycles?.map((cycle) => {
      if (cycle?.id === activeCycle?.id) {
        const updatedCycleProcesses = cycle?.cycleProcesses?.map((process) => {
          if (process?.id === activeProcess?.id) {
            const elapsedMilliseconds = Date.now() - process.startTime!;
            const elapsedSeconds = Math.ceil(elapsedMilliseconds / 1000);
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
          } else {
            const elapsedMilliseconds = Date.now() - process.startTime!;
            const elapsedSeconds = Math.ceil(elapsedMilliseconds / 1000);
            return {
              ...process,
              waitingTime: elapsedSeconds,
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
