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
  createdAt: date;
}
