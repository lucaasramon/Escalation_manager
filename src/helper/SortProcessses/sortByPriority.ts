import { IProcess } from '@/types';

export const sortByPriority = (processes: IProcess[]) => {
  const tempProcesses = [...processes];
  const sortedProcesses = tempProcesses.sort(
    (objA, objB) => Number(objB.priority) - Number(objA.priority),
  );
  return sortedProcesses;
};
