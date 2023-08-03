import { IProcess } from '@/types';

//Função responsável por alternar os processos da fila para o processo rodando
export const alternateQueuedProcessesHelper = async (
  queuedProcesses: IProcess[],
  setRunningProcess: React.Dispatch<React.SetStateAction<IProcess | null>>,
  quantum?: number | undefined,
) => {
  const updateRunningProcess = async (index: number) => {
    if (index > queuedProcesses.length) {
      return;
    }

    const process = queuedProcesses[index];

    await new Promise<void>((resolve) => {
      setRunningProcess(null);
      setTimeout(() => {
        setRunningProcess(process);
        resolve();
      }, 2500);
    });

    await new Promise<void>((resolve) => {
      setTimeout(
        () => {
          resolve();
        },
        quantum ? quantum * 1000 : process?.runningTime * 1000,
      );
    });
    await updateRunningProcess(index + 1);
  };
  await updateRunningProcess(0);
};
