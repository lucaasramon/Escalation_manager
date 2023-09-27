import { ICycle, IProcess } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { updateActiveProcessHelper } from './updateActiveProcessHelper';

export function UpdateActiveCycleHelper(
  setCycles: Dispatch<SetStateAction<ICycle[]>>,
  setActiveCycle: Dispatch<SetStateAction<ICycle>>,
  activeProcess: IProcess,
  activeCycle: ICycle,
  setProcesses: Dispatch<SetStateAction<IProcess[]>>,
  setActiveProcess: Dispatch<SetStateAction<IProcess>>,
  processIndex: number,
  setProcessIndex: React.Dispatch<React.SetStateAction<number>>,
  count: number,
  setCount: React.Dispatch<React.SetStateAction<number>>,
  quantum: number, 
  sortedProcesses: IProcess[],
) {
  if(activeCycle){
    setCycles((prevCycles: ICycle[]) => {
      const updatedCycles = prevCycles?.map((cycle) => {
        if (cycle?.id === activeCycle?.id) {

          const updatedCycleProcesses: IProcess[] = updateActiveProcessHelper(
            activeProcess,
            cycle,
            activeCycle,
            setActiveProcess,
            setProcessIndex,
            count,
            setCount,
            quantum,
          );

          setProcesses(updatedCycleProcesses);
          setActiveCycle((prevCycle) => ({...prevCycle, cycleProcesses: updatedCycleProcesses}))

          return {
            ...cycle,
            cycleProcesses: updatedCycleProcesses,
          };
        } 
        else {
          return cycle;
        }
      });
    return updatedCycles;
  });
}
}
