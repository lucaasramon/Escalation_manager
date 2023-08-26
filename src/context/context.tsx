'use client';
import { EscalationAlgorithm } from '@/enums';
import { ICycle, IProcess, IProcessesContext } from '@/types';
import { useContext, createContext, useState } from 'react';

export const ProcessesContext = createContext<IProcessesContext>(
  {} as IProcessesContext,
);

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [queuedProcesses, setQueuedProcesses] = useState<IProcess[]>([]);
  const [processes, setProcesses] = useState<IProcess[]>([]);
  const [processesToDisplay, setProcessesToDisplay] = useState<IProcess[]>([]);
  const [activeProcess, setActiveProcess] = useState<IProcess | null>(null);
  const [actualAlgorithm, setActualAlgorithm] = useState<
    EscalationAlgorithm | undefined
  >(undefined);
  const [cycles, setCycles] = useState<ICycle[]>([]);
  const [activeCycle, setActiveCycle] = useState<ICycle | undefined>(undefined);

  const contextValue: IProcessesContext = {
    processes,
    setProcesses,
    activeCycle,
    activeProcess,
    actualAlgorithm,
    cycles,
    queuedProcesses,
    setActiveCycle,
    setActiveProcess,
    setActualAlgorithm,
    setCycles,
    setQueuedProcesses,
    processesToDisplay,
    setProcessesToDisplay,
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
