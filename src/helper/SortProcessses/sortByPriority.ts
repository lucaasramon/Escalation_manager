import { ProcessState } from '@/enums';
import { IProcess } from '@/types';

export const sortByPriority = (processes: IProcess[]) => {
  let tempProcesses = processes.filter((process: IProcess) => process.hasArrived && process.state !== ProcessState.Finished && process.isActive);
  tempProcesses.sort(
    (objA, objB) => Number(objB.priority) - Number(objA.priority),
  );
  return tempProcesses;
};
