import { EscalationAlgorithm, ProcessState } from '@/enums';
import { ICycle, IProcess } from '@/types';

//Função responsável por alternar os processos da fila para o processo ativo
export const alternateQueuedProcessesHelper = async (
  sortedProcesses: IProcess[],
  actualAlgorithm: EscalationAlgorithm,
  activeCycle: ICycle,
  setActiveProcess: React.Dispatch<React.SetStateAction<IProcess | null>>,
  setCycles: React.Dispatch<React.SetStateAction<ICycle[]>>,
  quantum?: number | undefined,
) => {
  const changeActiveProcess = async (index: number) => {
    setActiveProcess(null);
    if (index > sortedProcesses.length) {
      return;
    }

    const tempProcess = sortedProcesses[index];

    await new Promise<void>((resolve) => {
      const interval = index > 0 ? 2000 : 500;
      setTimeout(() => {
        if (tempProcess) {
          setActiveProcess({ ...tempProcess, startTime: Date.now() });

          setCycles((prevCycles) => {
            if (Array.isArray(prevCycles)) {
              const updatedCycles = prevCycles.map((cycle) => {
                if (cycle?.id === activeCycle?.id) {
                  const updatedCycleProcesses = cycle?.cycleProcesses.map(
                    (process) => {
                      if (process?.id === tempProcess?.id) {
                        return {
                          ...process,
                          startTime: Date.now(),
                          state: ProcessState.Running,
                        };
                      }
                      return process;
                    },
                  );

                  return {
                    ...cycle,
                    cycleProcesses: updatedCycleProcesses,
                  };
                }
                return cycle;
              });

              return updatedCycles;
            }
            return prevCycles;
          });

          tempProcess.state = ProcessState.Running;
        }
        resolve();
      }, interval);
    });

    await new Promise<void>((resolve) => {
      const shouldUseQuantum = actualAlgorithm === EscalationAlgorithm.RR;
      const interval = shouldUseQuantum
        ? quantum! * 1000
        : tempProcess?.runningTime * 1000;
      setTimeout(() => {
        resolve();
      }, interval);
    });

    await changeActiveProcess(index + 1);
  };
  await changeActiveProcess(0);
};
