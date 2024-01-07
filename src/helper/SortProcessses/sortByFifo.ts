import { IProcess } from '@/types';

export const sortByFifo = (processes: IProcess[]) => {
  const tempProcesses = [...processes];
  tempProcesses.sort(
    (objA, objB) => Number(objA.createdAt) - Number(objB.createdAt) ,
  );

  const sortedProcesses = tempProcesses.filter((process) => process.isActive)
  return sortedProcesses;
};
