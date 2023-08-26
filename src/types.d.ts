import { ProcessState, ProcessType } from './enums';

export interface IProcess {
  id: number;
  priority: number;
  color: string;
  type: ProcessType;
  state: ProcessState;
  cpuUsageTime: number;
  waitingTime: number;
  runningTime: number;
  createdAt?: Date;
  startTime?: number;
}

export interface ICycle {
  id: number;
  status: CycleState;
  algorithm: EscalationAlgorithm;
  cycleProcesses: IProcess[];
}

interface IProcessesContext {
  processesToDisplay: IProcess[];
  setProcessesToDisplay: Dispatch<SetStateAction<IProcess[]>>;
  queuedProcesses: IProcess[];
  setQueuedProcesses: Dispatch<SetStateAction<IProcess[]>>;
  activeProcess: IProcess | null;
  setActiveProcess: Dispatch<SetStateAction<IProcess | null>>;
  actualAlgorithm: EscalationAlgorithm | undefined;
  setActualAlgorithm: Dispatch<SetStateAction<EscalationAlgorithm | undefined>>;
  cycles: ICycle[];
  setCycles: Dispatch<SetStateAction<ICycle[]>>;
  activeCycle: ICycle | undefined;
  setActiveCycle: Dispatch<SetStateAction<ICycle | undefined>>;
}
