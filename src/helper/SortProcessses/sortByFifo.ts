import { IProcess } from '@/types';

export const sortByFifo = (processes: IProcess[]) => {
  const tempProcesses = [...processes];
  const sortedProcesses = tempProcesses.sort(
    (objA, objB) => Number(objA.createdAt) - Number(objB.createdAt),
  );

  return sortedProcesses;
};
