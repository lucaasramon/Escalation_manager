'use client';
import { EscalationAlgorithm } from '@/enums';
import { ICycle, IProcess, IProcessesContext } from '@/types';
import { useContext, createContext, useState } from 'react';


export const ProcessesContext =
  createContext<IProcessesContext>({} as IProcessesContext);

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [processes, setProcesses] = useState<IProcess[]>([]);
  const [queuedProcesses, setQueuedProcesses] = useState<IProcess[]>([]);
  const [activeProcess, setActiveProcess] = useState<IProcess | null>(null);
  const [actualAlgorithm, setActualAlgorithm] = useState<
    EscalationAlgorithm | undefined
  >(undefined);
  const [cycles, setCycles] = useState<ICycle[]>([]);
  const [activeCycle, setActiveCycle] = useState<ICycle | undefined>(undefined);

  const contextValue: IProcessesContext = {
    activeCycle,
    activeProcess,
    actualAlgorithm,
    cycles,
    processes,
    queuedProcesses,
    setActiveCycle,
    setActiveProcess,
    setActualAlgorithm,
    setCycles,
    setProcesses,
    setQueuedProcesses,
  };

  return (
    <ProcessesContext.Provider value={contextValue}>
      {children}
    </ProcessesContext.Provider>
  );
}

export function useProcessesContext() {
  return useContext(ProcessesContext);
}
