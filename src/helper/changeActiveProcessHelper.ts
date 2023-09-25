import { CycleState, PreemptiveEscalationAlgorithm, ProcessState } from "@/enums";
import { ICycle, IProcess } from "@/types";

export const changeActiveProcess = (
    processIndex: number, 
    setActiveProcess: any, 
    sortedProcesses: IProcess[],
    currentAlgorithm: any,
    setProcessIndex: any,
    activeCycle: ICycle,
    setCycles: any,
    setActiveCycle: any
) => {

    setActiveProcess(null);
    console.log('processIndex: ', processIndex)
    
    if (processIndex >= sortedProcesses.length) {      
      setProcessIndex(0)
      if(currentAlgorithm !== PreemptiveEscalationAlgorithm.RR){
        return setCycles((prevCycles: ICycle[]) => {
          return prevCycles.map((cycle) => {
            if (cycle.id === activeCycle.id) {
              setActiveCycle({ ...activeCycle, status: CycleState.Finished });
              return { ...cycle, status: CycleState.Finished };
            }
            return cycle;
          });
        });
      }
      
      else{
        setCycles((prevCycles: ICycle[]) => {
            return prevCycles.map((cycle) => {
              if (cycle.id === activeCycle.id) {
                const areAllProcessesFinished = cycle.cycleProcesses.find((process) => {
                    if(process.state !== ProcessState.Finished) {
                        return process
                    }
                })
                if(!areAllProcessesFinished) {
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
    currentProcess.state = ProcessState.Running
    setActiveProcess(currentProcess)
  };