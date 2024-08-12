import { ProcessState, ProcessTypem, CycleState } from './enums';

export interface IProcess {
  id: number;
  priority: number;
  color: string;
  type: ProcessType;
  state: ProcessState;
  cpuUsageTime: number;
  waitingTime: number;
  runningTime: number;
  isActive: boolean;
  createdAt?: Date;
  startTime?: number;
  arrivalTime: number;
  hasArrived: boolean
}

export interface ICycle {
  id: number;
  status: CycleState;
  algorithm: EscalationAlgorithm;
  cycleProcesses: IProcess[];
  isPreemptive: boolean
  duration: number
}

interface IProcessesContext {
  processes: IProcess[];
  setProcesses: Dispatch<SetStateAction<IProcess[]>>;
  processesToDisplay: IProcess[];
  setProcessesToDisplay: Dispatch<SetStateAction<IProcess[]>>;
  queuedProcesses: IProcess[];
  setQueuedProcesses: Dispatch<SetStateAction<IProcess[]>>;
  activeProcess: IProcess | null;
  setActiveProcess: Dispatch<SetStateAction<IProcess | null>>;
  currentAlgorithm: EscalationAlgorithm | undefined;
  setCurrentAlgorithm: Dispatch<SetStateAction<EscalationAlgorithm>>;
  cycles: ICycle[];
  setCycles: Dispatch<SetStateAction<ICycle[]>>;
  activeCycle: ICycle | undefined;
  setActiveCycle: Dispatch<SetStateAction<ICycle>>;
  isPreemptive: boolean;
  setIsPreemptive: Dispatch<SetStateAction<boolean>>;
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
  processIndex: number
  setProcessIndex: Dispatch<SetStateAction<number>>;
  quantum: number
  setQuantum: Dispatch<SetStateAction<number>>;
  isCycleRunning: boolean
  setIsCycleRunning: Dispatch<SetStateAction<boolean>>;
}
