import { IProcess } from '@/types';

export const sortBySjf = (processes: IProcess[]) => {
  const tempProcesses = [...processes];
  const sortedProcesses = tempProcesses.sort(
    (objA, objB) => Number(objA.runningTime) - Number(objB.runningTime),
  );
  return sortedProcesses;
};
