'use client';
import React, { useEffect, useState } from 'react';
import CreateProcess from './components/CreateProcess';
import { ICycle, IProcess } from '@/types';
import ProcessTable from './components/ProcessTable';
import { Plus, Cpu, Play, Info, Broom, ArrowDown, ArrowUp } from '@phosphor-icons/react';
import { CycleState, NonPreemptiveEscalationAlgorithm, PreemptiveEscalationAlgorithm, ProcessState } from '@/enums';
import SelectEscalationAlgorithm from './components/EscalationAlgorithm';
import Quantum from './components/Quantum';
import CyclesStatistics from './components/Cycles/CyclesStatistics';
import { UpdateActiveCycleHelper } from '@/helper/updateActiveCycleHelper';
import { useProcessesContext } from '@/context/context';
import { sortProcessesHelper } from '@/helper/sortProcessesHelper';
import { changeActiveProcess } from '@/helper/changeActiveProcessHelper';
import { generateRandomProcesses } from '@/helper/generateRandomProcesses';

export default function Process() {
  const {
    cycles,
    setCycles,
    activeCycle,
    activeProcess,
    currentAlgorithm,
    setActiveProcess,
    setActiveCycle,
    processes,
    setProcesses,
    isPreemptive,
    count,
    setCount,
    processIndex, 
    setProcessIndex,
    quantum,
    setQuantum,
  } = useProcessesContext();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showStatistics, setShowStatistics] = useState<boolean>(false);
  const [arrow, setArrow] = useState<boolean>(false);
  const [sortedProcesses, setSortedProcesses] = useState<IProcess[]>([]);
  const [processesQuantity, setProcessesQuantity] = useState<number>(1);

  console.log('isPreemptive: ', isPreemptive)

  const handleCreateMultipleProcesses = () => {
    generateRandomProcesses(
      setProcesses,
      activeCycle,
      setActiveCycle,
      setCycles,
      activeProcess,
      isPreemptive,
      processesQuantity
    )
    setProcessesQuantity(1)
  }

  const toggleShowStatistics = () => {
    setShowStatistics((prevShowStatistics) => !prevShowStatistics);
  };

  const wipeProcesses = () => {
    setProcesses([]);
  };

  console.log('sortedProcesses: ', sortedProcesses)

  // useEffect resetar as informações da tabela quando o EscalationAlgorithm for trocado
  useEffect(() => {
    setProcesses((prevProcesses: IProcess[]) =>
      prevProcesses.map((process) => {
        return {
          ...process,
          cpuUsageTime: 0,
          waitingTime: 0,
          state: ProcessState.Ready,
        };
      }),
    );
  }, [currentAlgorithm]);

  // useEffect para atualizar as informações dos processos do ciclo ativo
  useEffect(() => {
    if (activeCycle && activeProcess) {
      const intervalId = setInterval(() => {

        UpdateActiveCycleHelper(
          setCycles,
          setActiveCycle,
          activeProcess,
          activeCycle,
          setProcesses,
          setActiveProcess,
          processIndex,
          setProcessIndex,
          count,
          setCount,
          quantum,
          sortedProcesses,
        );

      }, 950);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [activeProcess]);

  // useEffect para ordenar e alternar os processos na cpu
  useEffect(() => {
    if (activeCycle?.status === CycleState.Active) {
      let sortedProcesses = sortProcessesHelper(currentAlgorithm, activeCycle, setProcessIndex)
      setSortedProcesses(sortedProcesses)
      changeActiveProcess(
        processIndex, 
        setActiveProcess, 
        sortedProcesses, 
        currentAlgorithm,
        setProcessIndex,
        activeCycle,
        setCycles,
        setActiveCycle
      );
    }
  }, [activeCycle, activeCycle?.cycleProcesses, cycles, activeProcess?.state]);

  const handlePlay = () => {
    const newProcesses = processes.map((process) => ({
      ...process,
      cpuUsageTime: 0,
      waitingTime: 0,
      state: ProcessState.Ready,
    }));

    setProcesses(newProcesses);

    const newCycle: ICycle = {
      id: cycles.length + 1,
      algorithm: currentAlgorithm,
      cycleProcesses: newProcesses,
      status: CycleState.Active,
      isPreemptive: isPreemptive
    };

    setProcessIndex(0)
    setActiveCycle(newCycle);
    setCycles((prevState: ICycle[]) => [...prevState, newCycle]);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 items-center p-2">
        <div className="w-full flex flex-col gap-2 items-start md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row">
          <details className="dropdown mb-32">
            <summary className="btn btn-primary" onClick={() => setArrow(!arrow)}>Processo 
            {!arrow ? <ArrowDown size={32} /> : <ArrowUp size={32} />}
            </summary>
            <ul className="p-2 shadow menu  dropdown-content z-[1] bg-base-100 rounded-box w-52">
              <li
                onClick={() => setShowModal(!showModal)}
              >
                <a>único</a>
              </li>

              <li className='flex border-2 gap-2' >
                <a onClick={handleCreateMultipleProcesses}>multíplos</a>
              <div>
                <input 
                  type="range" 
                  min={1} max="15" 
                  onChange={(e) => setProcessesQuantity(Number(e.target.value))} 
                  value={processesQuantity} 
                  className="range range-primary" />
                <span>{processesQuantity}</span>
              </div>
              </li>
            </ul>
          </details>

            <button
              className="btn btn-primary"
              onClick={wipeProcesses}
              disabled={processes.length === 0 || !!activeProcess}
            >
              Limpar <Broom size={32} />
            </button>
          </div>

          <button
            onClick={handlePlay}
            className="btn btn-primary"
            disabled={processes.length === 0}
          >
            <Play size={32} />
          </button>
        </div>

        <div className="flex gap-2 justify-between items-center w-full">
          <div className="flex flex-col gap-2 justify-start items-start">
            <SelectEscalationAlgorithm/>

            {currentAlgorithm === PreemptiveEscalationAlgorithm.RR && (
              <Quantum setQuantum={setQuantum} quantum={quantum} />
            )}
          </div>

          {cycles && (
            <div>
              <button
                onClick={toggleShowStatistics}
                className="btn btn-primary"
                disabled={cycles.length === 0}
              >
                <Info size={32} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center flex-col gap-2 p-4 shadow-lg rounded-lg h-[200px] w-[200px]">
          <Cpu
            size={40}
            className={`${activeProcess ? 'animate-ping text-red-500' : ''}`}
          />

          {activeProcess && (
            <div className="flex flex-col p-4 items-center">
              <div className="flex p-2 gap-2 items-center">
                <h2 className="text-green-500 italic">Executando...</h2>
              </div>

              <div className="flex gap-1 items-center">
                <span
                  style={{ backgroundColor: activeProcess?.color }}
                  className={`rounded-full h-2 w-2 inline-block`}
                />
                <span>{activeProcess?.id}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <CreateProcess
          setShowModal={setShowModal}
          showModal={showModal}
          quantum={quantum}
        />
      )}

      {showStatistics && (
        <CyclesStatistics
          cycles={cycles}
          showStatistics={toggleShowStatistics}
          quantum={quantum}
        />
      )}

      <ProcessTable quantum={quantum} />
    </div>
  );
}
