import { ProcessState } from '@/enums';
import { IProcess } from '@/types';

//Função responsável por alternar os processos da fila para o processo ativo
export const alternateQueuedProcessesHelper = async (
  sortedProcesses: IProcess[],
  setActiveProcess: React.Dispatch<React.SetStateAction<IProcess | null>>,
  quantum?: number | undefined,
) => {
  const changeActiveProcess = async (index: number) => {
    if (index > sortedProcesses.length) {
      return;
    }

    const process = sortedProcesses[index];

    await new Promise<void>((resolve) => {
      setActiveProcess(null);
      const interval = index > 0 ? 2000 : 500;
      setTimeout(() => {
        if (process) {
          process.startTime = Date.now();
          process.state = ProcessState.Running;
          setActiveProcess(process);
        }
        resolve();
      }, interval);
    });

    await new Promise<void>((resolve) => {
      const interval = quantum ? quantum * 1000 : process?.runningTime * 1000;
      setTimeout(() => {
        resolve();
      }, interval);
    });

    await changeActiveProcess(index + 1);
  };
  await changeActiveProcess(0);
};
