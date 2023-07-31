import { ProcessState, ProcessType } from './enums';

export interface IProcessType {
  id: number;
  name: ProcessType;
}

export interface IProcess {
  id?: number;
  priority: number;
  color: string;
  type: IProcessType;
  state?: ProcessState;
  cpuTime?: number;
  timeCreated?: number;
}
