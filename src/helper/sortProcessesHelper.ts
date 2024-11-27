import { NonPreemptiveEscalationAlgorithm, PreemptiveEscalationAlgorithm, ProcessState } from "@/enums";
import { ICycle, IProcess } from "@/types";
import { sortByFifo } from "./SortProcessses/sortByFifo";
import { sortBySjf } from "./SortProcessses/sortBySjf";
import { sortByPriority } from "./SortProcessses/sortByPriority";
import { Dispatch, SetStateAction } from "react";
import { sortByRoundRobin } from "./SortProcessses/sortByRoundRobin";

export const sortProcessesHelper = (
    currentAlgorithm: NonPreemptiveEscalationAlgorithm | PreemptiveEscalationAlgorithm, 
    activeCycle: ICycle,
    ) => {
    
    let sortedProcesses: IProcess[] = []

    if (currentAlgorithm === NonPreemptiveEscalationAlgorithm.FIFO) {
        sortedProcesses = sortByFifo(activeCycle?.cycleProcesses);
    } else if (currentAlgorithm === NonPreemptiveEscalationAlgorithm.SJF) {
        sortedProcesses = sortBySjf(activeCycle?.cycleProcesses);
    } else if (currentAlgorithm === PreemptiveEscalationAlgorithm.Priority) {
        sortedProcesses = sortByPriority(activeCycle?.cycleProcesses);
        sortedProcesses = sortedProcesses.filter((process) => process.state !== ProcessState.Finished)

    } else if (currentAlgorithm === PreemptiveEscalationAlgorithm.RR) {
        sortedProcesses = sortByRoundRobin(activeCycle?.cycleProcesses);
    }

    sortedProcesses.forEach((process, index) => {
        process.position = index+1
    })

    return sortedProcesses
}