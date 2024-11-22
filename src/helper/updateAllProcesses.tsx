import { ICycle, IProcess } from "@/types";
import { Dispatch, SetStateAction } from "react";

export const updateAllProcesses = (
  activeCycle: ICycle | undefined,
  setCycles: Dispatch<SetStateAction<ICycle[]>>,
  setProcesses: Dispatch<SetStateAction<IProcess[]>>
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
  }
}