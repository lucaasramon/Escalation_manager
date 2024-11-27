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

  // Reinicia o índice se ultrapassar o tamanho do array
  if (processIndex >= sortedProcesses.length) {
    setProcessIndex(0);
    return;
  }

  const currentProcess = sortedProcesses[processIndex];

  if (currentProcess) {

    // Verifica se o processo deve ser finalizado
    if (currentProcess.cpuUsageTime >= currentProcess.runningTime) {
      currentProcess.state = ProcessState.Finished;

      // Verifica se todos os processos foram finalizados
      const unfinishedProcesses = sortedProcesses.some(
        (process) => process.state !== ProcessState.Finished
      );

      if (!unfinishedProcesses) {
        setActiveProcess(null);
        return;
      }


    } else if (
      currentProcess.state !== ProcessState.Finished &&
      currentProcess.state !== ProcessState.roundRobin
    ) {
      currentProcess.state = ProcessState.Running;
      return setActiveProcess(currentProcess);
    } else {
      // Incrementa o índice para continuar com o próximo processo
      setProcessIndex((prev) => prev + 1);

      if (
      currentProcess.runningTime >= currentProcess.cpuUsageTime &&
      currentProcess.state === ProcessState.roundRobin
    ) {
      currentProcess.state = ProcessState.Ready;
      return setActiveProcess(currentProcess);
    }
    }
  } else {
    setActiveProcess(null);
  }
};
