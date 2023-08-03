import { ProcessState, ProcessType } from './enums';

export interface IProcess {
  id?: number;
  priority: number;
  color: string;
  type: ProcessType;
  state?: ProcessState;
  cpuTime?: number;
  runningTime: number;
  timeCreated?: date;
}
