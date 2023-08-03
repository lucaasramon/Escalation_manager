import { IProcess } from '@/types';

export const sortByFifo = (
  processes: IProcess[],
  setQueuedProcesses: React.Dispatch<React.SetStateAction<IProcess[]>>,
) => {
  const tempProcesses = [...processes];
  const sortedProcesses = tempProcesses.sort(
    (objA, objB) => Number(objA.timeCreated) - Number(objB.timeCreated),
  );
  setQueuedProcesses(sortedProcesses);
};
