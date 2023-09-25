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
    quantum: any,  
    ) => {

    const updatedProcesses  = cycle?.cycleProcesses?.map((process) => {
        const timeLimit = process?.runningTime;

        if (process?.id === activeProcess?.id) {

          process.state = ProcessState.Running
          setCount(prev => prev + 1)

          const shouldUpdateIndex = shouldUpdateIndexHelper(
            activeCycle,
            count,
            quantum
          )
    
          if (shouldUpdateIndex) {
            console.log('ESTA CAINDO AQUI')
            process.state = ProcessState.Ready;
            setActiveProcess(prev => ({...prev, state: ProcessState.Ready}))
            setProcessIndex(prev => prev + 1) 
            setCount(1)
          }

          setActiveProcess({...activeProcess, 
            cpuUsageTime: activeProcess.cpuUsageTime + 1, 
            state: ProcessState.Running
          })

          if (Math.ceil(process?.cpuUsageTime + 1) >= timeLimit) {
            process.state = ProcessState.Finished;
            setActiveProcess({...activeProcess, state: ProcessState.Finished})

            if(cycle.algorithm  === NonPreemptiveEscalationAlgorithm.FIFO || NonPreemptiveEscalationAlgorithm.SJF){
              console.log('É um algoritmo não preemptivo')
              setProcessIndex((prev) => prev + 1)
            }
            console.log('É um algoritmo preemptivo')
          }

          return {
            ...process,
            cpuUsageTime: Math.ceil(process.cpuUsageTime + 1),
          };
        } 
        else {

          if(process.state !== ProcessState.Finished){ 
            return {
              ...process,
              waitingTime: Math.ceil(process.waitingTime + 1),
            };
          }
          return process
        }
      });
    return updatedProcesses
}