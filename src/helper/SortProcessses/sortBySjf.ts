import { IProcess } from '@/types';

export const sortBySjf = (
  processes: IProcess[],
  setQueuedProcesses: React.Dispatch<React.SetStateAction<IProcess[]>>,
) => {
  const tempProcesses = [...processes];
  const sortedProcesses = tempProcesses.sort(
    (objA, objB) => Number(objA.runningTime) - Number(objB.runningTime),
  );
  console.log(sortedProcesses);
  setQueuedProcesses(sortedProcesses);
};
