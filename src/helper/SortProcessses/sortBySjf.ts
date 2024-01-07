import { IProcess } from '@/types';

export const sortBySjf = (processes: IProcess[]) => {
  const tempProcesses = [...processes];
  tempProcesses.sort(
    (objA, objB) => Number(objA.runningTime) - Number(objB.runningTime),
  );

  const sortedProcesses = tempProcesses.filter((process) => process.isActive)
  return sortedProcesses;
};
