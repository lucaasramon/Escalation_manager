import { CycleState, NonPreemptiveEscalationAlgorithm, PreemptiveEscalationAlgorithm, ProcessState } from "@/enums";
import { ICycle, IProcess } from "@/types";
import { Dispatch, SetStateAction } from "react";

export const changeActiveProcess = (
    activeProcess: IProcess | null,
    processIndex: number, 
    setActiveProcess: Dispatch<SetStateAction<IProcess | null>>,
    sortedProcesses: IProcess[],
    currentAlgorithm: PreemptiveEscalationAlgorithm | NonPreemptiveEscalationAlgorithm,
    setProcessIndex: Dispatch<SetStateAction<number>>,
    activeCycle: ICycle,
    setCycles: Dispatch<SetStateAction<ICycle[]>>,
    setActiveCycle: Dispatch<SetStateAction<ICycle>>
) => {

    setActiveProcess(null);
    
    if (processIndex >= sortedProcesses.length) {   
      setProcessIndex(0)
      if(currentAlgorithm !== PreemptiveEscalationAlgorithm.RR){
        return setCycles((prevCycles: ICycle[]) => {
          return prevCycles.map((cycle) => {
            if (cycle.id === activeCycle.id) {
              const allFinished = cycle.cycleProcesses.every(
                process => process.state === ProcessState.Finished
              );
              if(allFinished) {
                  setActiveCycle({ ...activeCycle, status: CycleState.Finished });
                  return { ...cycle, status: CycleState.Finished };
              }
            }
            return cycle;
          });
        });
      }
      
      else{
          setCycles((prevCycles: ICycle[]) => {
            return prevCycles.map((cycle) => {
              if (cycle.id === activeCycle.id) {
                const allFinished = cycle.cycleProcesses.every(
                  process => process.state === ProcessState.Finished
                );
                if(allFinished) {
                    setActiveCycle({ ...activeCycle, status: CycleState.Finished });
                    return { ...cycle, status: CycleState.Finished };
                }
              }
              return cycle;
            });
          });
        return setProcessIndex(0)
      }
    }
    
    const currentProcess = sortedProcesses[processIndex];

    if(currentProcess.state != ProcessState.Finished){
      currentProcess.state = ProcessState.Running
    }else{
      return setProcessIndex(prev => prev +1)
    }

    return setActiveProcess(currentProcess)
  };