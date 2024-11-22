import { CycleState, NonPreemptiveEscalationAlgorithm, PreemptiveEscalationAlgorithm, ProcessState } from "@/enums";
import { ICycle, IProcess } from "@/types";
import { Dispatch, SetStateAction } from "react";
import { UpdateActiveCycleHelper } from "./updateActiveCycleHelper";

export const changeOrInitializeActiveProcess = (
    processIndex: number, 
    setActiveProcess: Dispatch<SetStateAction<IProcess | null>>,
    sortedProcesses: IProcess[],
    setProcessIndex: Dispatch<SetStateAction<number>>,
) => {
  debugger
    if (processIndex > sortedProcesses.length) {   
      setProcessIndex(0)
    }else{
      const currentProcess = sortedProcesses[processIndex];
      if(currentProcess){
        if(currentProcess.state !== ProcessState.Finished){
          currentProcess.state = ProcessState.Running
          return setActiveProcess(currentProcess)
        }else{
          return setProcessIndex(prev => prev +1)
        }
      }else{
        setActiveProcess(null)
      }
    }
  };