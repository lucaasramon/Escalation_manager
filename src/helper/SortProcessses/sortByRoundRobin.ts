import { ProcessState } from '@/enums';
import { IProcess } from '@/types';

export const sortByRoundRobin = (processes: IProcess[]) => {
  const tempProcesses = processes.filter((process: IProcess) => process.hasArrived && process.state !== ProcessState.Finished && process.isActive);

  tempProcesses.sort(
    (objA, objB) => Number(objA.arrivalDate) - Number(objB.arrivalDate)
  );

  return tempProcesses;
};
