import { ProcessState } from '@/enums';
import { ICycle, IProcess } from '@/types';

export function UpdateActiveCycleHelper(
  setCycles: React.Dispatch<React.SetStateAction<ICycle[]>>,
  activeProcess: IProcess,
  activeCycle: ICycle,
) {

  setCycles((prevCycles: ICycle[]) => {
    const updatedCycles = prevCycles?.map((cycle) => {

      if (cycle?.id === activeCycle?.id) {
        const updatedCycleProcesses = cycle?.cycleProcesses?.map((process) => {

          let elapsedMilliseconds = 0;
          let elapsedSeconds = 0;

          if (process?.id === activeProcess?.id) {

            if (!process.startTime) {
              process.startTime = Date.now();
            }

              elapsedMilliseconds = Date.now() - process.startTime;
              elapsedSeconds = Math.ceil(elapsedMilliseconds / 1000);

            
            if (process?.cpuUsageTime >= process?.runningTime) {
              return {
                ...process,
              };
            }

            return {
              ...process,
              cpuUsageTime: elapsedSeconds,
            };
          } else if(process?.id !== activeProcess?.id) {
            
            if (!process.startTime) {
            process.startTime = Date.now();
              }

               elapsedMilliseconds = Date.now() - process.startTime;
               elapsedSeconds = Math.ceil(elapsedMilliseconds / 1000);
               console.log(elapsedSeconds)

              return {
                ...process,
                waitingTime: elapsedSeconds,
              };
          }

          return process
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
