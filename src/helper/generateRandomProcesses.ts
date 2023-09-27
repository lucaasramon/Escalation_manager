import { CycleState, ProcessState, ProcessType } from "@/enums";
import { ICycle, IProcess } from "@/types";
import { getRandomColor } from "@/utils/getRandomColor";
import { generateUniqueNumber } from "@/utils/idGenerator";
import { Dispatch, SetStateAction } from "react";

export const generateRandomProcesses = (
    setProcesses: Dispatch<SetStateAction<IProcess[]>>,
    activeCycle: ICycle | undefined,
    setActiveCycle: Dispatch<SetStateAction<ICycle>>,
    setCycles: Dispatch<SetStateAction<ICycle[]>>,
    activeProcess: IProcess | null,
    isPreemptive: boolean,
    processesQuantity: number

) => {
  if(processesQuantity) {
    for (let index = 0; index < processesQuantity; index++) {
      const newProcess: IProcess = {
        id: generateUniqueNumber(1000, 9999),
        priority: Math.floor(Math.random()  * (15 - 1) + 1),
        color: getRandomColor(),
        type: Math.random() < 0.5 ? ProcessType.CpuBound : ProcessType.IOBound,
        // runningTime: Math.floor(Math.random() * (20 - 5) + 5),
        runningTime: 10,
        cpuUsageTime: 0,
        waitingTime: 0,
        state: ProcessState.Ready,
        createdAt: new Date(),
      };

      setProcesses((prevProcesses: IProcess[]) => [...prevProcesses, newProcess]);

    if (activeCycle?.status === CycleState.Active && isPreemptive) {
      setActiveCycle((prevActiveCycle: ICycle) => ({
        ...prevActiveCycle,
        cycleProcesses: [...prevActiveCycle.cycleProcesses.map((process) => {
          if(process.id === activeProcess?.id) {
            return {
              ...process, state: ProcessState.Ready
            }
          }
          return process
        }), newProcess],
      }));
    
      setCycles((prevCycles: ICycle[]) =>
        prevCycles.map((cycle) => {
          if (cycle.id === activeCycle.id) {
            return {
              ...cycle,
              cycleProcesses: [...cycle.cycleProcesses.map((process) => {
                if(process.id === activeProcess?.id) {
                  return {
                    ...process, state: ProcessState.Ready
                  }
                }
                return process
              }), newProcess],
            };
          }
          return cycle;
        })
      );
    }
      
    }
  }
    
}                    
