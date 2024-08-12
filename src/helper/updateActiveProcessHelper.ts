import { NonPreemptiveEscalationAlgorithm, PreemptiveEscalationAlgorithm, ProcessState } from "@/enums";
import { shouldUpdateIndexHelper } from "./shouldUpdateIndexHelper";
import { ICycle, IProcess } from "@/types";
import { Dispatch, SetStateAction } from "react";

export const updateActiveProcessHelper = (
    activeProcess: IProcess,
    cycle: ICycle,
    activeCycle: ICycle,
    setActiveProcess: Dispatch<SetStateAction<IProcess>>,
    setProcessIndex: React.Dispatch<React.SetStateAction<number>>,
    count: number,
    setCount: React.Dispatch<React.SetStateAction<number>>,
    quantum: number,  
    cycleDuration: number
    ) => {

    const hasArrived = (process: IProcess) => {
      if(cycleDuration >= process.arrivalTime){
        process.hasArrived =  true
        return process
      }
    }

    const updatedProcesses  = cycle?.cycleProcesses?.map((process) => {
      if (process.state === ProcessState.Finished || !process.isActive) {
        return process
      }

      else{
        hasArrived(process)
        if (process?.id === activeProcess?.id) {
          if(process.cpuUsageTime >= process.runningTime){
             setProcessIndex(prev => prev + 1)  //apagar tlavez
            return {...process, state: ProcessState.Finished} 
          }

          const timeLimit = process?.runningTime;

          setActiveProcess({...activeProcess, 
            cpuUsageTime: activeProcess.cpuUsageTime + 1, 
            state: ProcessState.Running
          })
            
          if (Math.ceil(process?.cpuUsageTime + 1) >= timeLimit) {
            setActiveProcess({...activeProcess, 
              state: ProcessState.Finished, 
              cpuUsageTime: activeProcess.cpuUsageTime + 1})


            if(cycle.algorithm === PreemptiveEscalationAlgorithm.RR || 
              cycle.algorithm === PreemptiveEscalationAlgorithm.Priority){
                if(cycle.algorithm === PreemptiveEscalationAlgorithm.RR){
                  setCount(1)
                }
            }else{
              setProcessIndex((prev) => prev + 1)
            }
            
            return {
              ...process, 
              state: ProcessState.Finished, 
              cpuUsageTime: Math.ceil(process.cpuUsageTime + 1),
            }
          }

          if(cycle.algorithm === PreemptiveEscalationAlgorithm.RR && 
            Math.ceil(process?.cpuUsageTime + 1) < timeLimit){
            setCount(prev => prev + 1)
            
            const shouldUpdateIndex = shouldUpdateIndexHelper( 
              count,
              quantum,
            )

            if (shouldUpdateIndex ) {
                setActiveProcess(prev => ({...prev, state: ProcessState.Ready}))
                setProcessIndex(prev => prev + 1) 
                setCount(1)
                return {
                  ...process, 
                  state: ProcessState.Ready,
                  cpuUsageTime: process.cpuUsageTime + 1
                }
            }
          }

          return {
            ...process,
            cpuUsageTime: Math.ceil(process.cpuUsageTime + 1),
          };
        } 
        else {
            return {
              ...process,
              waitingTime: Math.ceil(process.waitingTime + 1),
            };
          }
      }
      });
    return updatedProcesses
}