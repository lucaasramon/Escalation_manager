import { ProcessState } from '@/enums';
import { IProcess } from '@/types';

export const sortBySjf = (processes: IProcess[]) => {
  let tempProcesses = processes.filter((process: IProcess) => process.hasArrived && process.state !== ProcessState.Finished && process.isActive);
  tempProcesses.sort(
    (objA, objB) => Number(objA.runningTime) - Number(objB.runningTime),
  );

  return tempProcesses
};
