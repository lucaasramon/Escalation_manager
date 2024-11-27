import { ICycle, IProcess } from "@/types";
import { Dispatch, SetStateAction } from "react";
import { sortProcessesHelper } from '@/helper/sortProcessesHelper';
import { CycleState, NonPreemptiveEscalationAlgorithm, PreemptiveEscalationAlgorithm, ProcessState } from "@/enums";
import { useProcessesContext } from '@/context/context';
import { changeOrInitializeActiveProcess } from '@/helper/changeActiveProcessHelper';

export const updateAllProcesses = (
  activeCycle: ICycle | undefined,
  setCycles: Dispatch<SetStateAction<ICycle[]>>,
  setProcesses: Dispatch<SetStateAction<IProcess[]>>,
  activeProcess?: IProcess | null,
  currentAlgorithm?: NonPreemptiveEscalationAlgorithm | PreemptiveEscalationAlgorithm,
  setActiveProcess?: Dispatch<SetStateAction<IProcess | null>>,
  processIndex?: number, 
  setProcessIndex?:  Dispatch<SetStateAction<number>>,
  activeUpdate?: boolean
) => {

  if (activeCycle) {
    setCycles((cycles: ICycle[]) => {
      return cycles.map((cycle) => {

        if (cycle.id === activeCycle.id) {
          return {
            ...cycle,
            cycleProcesses: activeCycle.cycleProcesses,
            status: activeCycle.status,
            duration: activeCycle.duration
          }
        } else {
          return cycle
        }
      })
    })

    setProcesses(activeCycle.cycleProcesses)
    if (activeCycle?.status === CycleState.Active && activeUpdate) {
      console.log("2@@", activeCycle)
      if (currentAlgorithm) {
        const sortedProcesses = sortProcessesHelper(currentAlgorithm, activeCycle);
        console.log("3@@", sortedProcesses)

        if (
          (!activeCycle.isPreemptive &&
            (sortedProcesses.length > 0 && !activeProcess) ||
            (activeProcess?.state === ProcessState.Finished)) ||
          activeCycle.isPreemptive
        ) {

          if (setActiveProcess && setProcessIndex) {
            const validProcessIndex = processIndex ?? 0;

            changeOrInitializeActiveProcess(
              validProcessIndex,
              setActiveProcess,
              sortedProcesses,
              setProcessIndex,
            );
          } else {
            console.error("setActiveProcess está indefinido.");
          }
        }
      } else {
        console.error("currentAlgorithm está indefinido.");
      }
    }

  }
}