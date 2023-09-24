'use client';
import { NonPreemptiveEscalationAlgorithm, PreemptiveEscalationAlgorithm } from '@/enums';
import { ICycle, IProcess, IProcessesContext } from '@/types';
import { useContext, createContext, useState, useEffect } from 'react';

export const ProcessesContext = createContext<IProcessesContext>(
  {} as IProcessesContext,
);

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [queuedProcesses, setQueuedProcesses] = useState<IProcess[]>([]);
  const [processes, setProcesses] = useState<IProcess[]>([]);
  const [processesToDisplay, setProcessesToDisplay] = useState<IProcess[]>([]);
  const [activeProcess, setActiveProcess] = useState<IProcess | null>(null);
  const [currentAlgorithm, setCurrentAlgorithm] = useState<
  PreemptiveEscalationAlgorithm | NonPreemptiveEscalationAlgorithm | undefined
  >(undefined);
  const [cycles, setCycles] = useState<ICycle[]>([]);
  const [activeCycle, setActiveCycle] = useState<ICycle | undefined>(undefined);
  const [isPreemptive, setIsPreemptive] = useState<boolean>(false);
  const [count, setCount] = useState<number>(1);
  const [processIndex, setProcessIndex] = useState<number>(0);
  const [quantum, setQuantum] = useState<number>(5);

  const contextValue: IProcessesContext = {
    processes,
    setProcesses,
    activeCycle,
    activeProcess,
    currentAlgorithm,
    cycles,
    queuedProcesses,
    setActiveCycle,
    setActiveProcess,
    setCurrentAlgorithm,
    setCycles,
    setQueuedProcesses,
    processesToDisplay,
    setProcessesToDisplay,
    isPreemptive,
    setIsPreemptive,
    count,
    setCount,
    processIndex,
    setProcessIndex,
    quantum, 
    setQuantum
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
