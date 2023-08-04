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
      const interval = index > 0 ? 2000 : 500;
      setTimeout(() => {
        setRunningProcess(process);
        resolve();
      }, interval);
    });

    await new Promise<void>((resolve) => {
      const interval = quantum ? quantum * 1000 : process?.runningTime * 1000;
      console.log('INTERVAL: ', interval);
      setTimeout(() => {
        resolve();
      }, interval);
    });
    await updateRunningProcess(index + 1);
  };
  await updateRunningProcess(0);
};
