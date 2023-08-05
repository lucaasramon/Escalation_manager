import { IProcess } from '@/types';

//Função responsável por alternar os processos da fila para o processo rodando
export const alternateQueuedProcessesHelper = async (
  queuedProcesses: IProcess[],
  setActiveProcess: React.Dispatch<React.SetStateAction<IProcess | null>>,
  quantum?: number | undefined,
) => {
  const changeActiveProcess = async (index: number) => {
    if (index > queuedProcesses.length) {
      return;
    }

    const process = queuedProcesses[index];

    await new Promise<void>((resolve) => {
      setActiveProcess(null);
      const interval = index > 0 ? 2000 : 500;
      setTimeout(() => {
        setActiveProcess(process);
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
