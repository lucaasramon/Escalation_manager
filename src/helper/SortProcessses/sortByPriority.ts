import { ProcessState } from '@/enums';
import { IProcess } from '@/types';

export const sortByPriority = (processes: IProcess[]) => {
  const tempProcesses = processes.filter((process: IProcess) => process.hasArrived && process.state !== 'Concluído' && process.isActive);
  tempProcesses.sort(
    (objA, objB) => Number(objB.priority) - Number(objA.priority),
  );

  return tempProcesses;
};
