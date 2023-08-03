import { IProcess } from '@/types';

export const sortByPriority = (
  processes: IProcess[],
  setQueuedProcesses: React.Dispatch<React.SetStateAction<IProcess[]>>,
) => {
  const tempProcesses = [...processes];
  const sortedProcesses = tempProcesses.sort(
    (objA, objB) => Number(objB.priority) - Number(objA.priority),
  );
  console.log(sortedProcesses);
  setQueuedProcesses(sortedProcesses);
};
