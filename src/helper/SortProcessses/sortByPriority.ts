import { IProcess } from '@/types';

export const sortByPriority = (processes: IProcess[]) => {
  const tempProcesses = [...processes];
  tempProcesses.sort(
    (objA, objB) => Number(objB.priority) - Number(objA.priority),
  );
  const sortedProcesses = tempProcesses.filter((process) => process.isActive)
  return sortedProcesses;
};
