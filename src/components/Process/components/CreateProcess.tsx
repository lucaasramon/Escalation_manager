'use client';
import { useProcessesContext } from '@/context/context';
import {
  CycleState,
  ProcessState,
  ProcessType,
  colors,
} from '@/enums';
import { generateMultipleProcesses } from '@/helper/generateMultipleProcesses';
import { ICycle, IProcess } from '@/types';
import { generateUniqueNumber } from '@/utils/idGenerator';
import { Minus, Plus } from '@phosphor-icons/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type CreateProcessProps = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  quantum?: number;
};

enum ProcessCreationType {
  random = 'random',
  parametized = 'parametized'
}

export default function CreateProcess({
  setShowModal,
  showModal,
}: CreateProcessProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { 
    setProcesses, 
    activeCycle, 
    setActiveCycle, 
    setCycles, 
    isPreemptive, 
    activeProcess
  } = useProcessesContext();

  const [tab, setTab] = useState<number>(1)
  const [processesQuantity, setProcessesQuantity] = useState<number>(1);

  const handleDecreaseQuantity = () => {
    if(processesQuantity <= 1) {
      return
    }else{
      setProcessesQuantity(prev => prev - 1)
    }
  }

  const onSubmit: any = (data: IProcess, processCreationType: ProcessCreationType = ProcessCreationType.parametized) => {
    console.log(processCreationType)
    console.log(data)
    if(processCreationType === ProcessCreationType.parametized) {

      const newProcess: IProcess = {
        id: generateUniqueNumber(1000, 9999),
        priority: Number(data.priority),
        color: data.color,
        type: data.type,
        runningTime: Number(data.runningTime),
        cpuUsageTime: 0,
        waitingTime: 0,
        state: ProcessState.Ready,
        createdAt: new Date(),
      };

      if(processesQuantity > 1)  {
        generateMultipleProcesses(
          setProcesses,
          activeCycle,
          setActiveCycle,
          setCycles,
          activeProcess,
          isPreemptive,
          processesQuantity,
          newProcess
        )
        setProcessesQuantity(1)
      }

      else{
        setProcesses((prevProcesses: IProcess[]) => [...prevProcesses, newProcess]);
  
      if (activeCycle?.status === CycleState.Active && isPreemptive) {
        setActiveCycle((prevActiveCycle: ICycle) => ({
          ...prevActiveCycle,
          cycleProcesses: [...prevActiveCycle.cycleProcesses.map((process) => {
            if(process.id === activeProcess?.id) {
              return {
                ...process, state: ProcessState.Ready
              }
            }
            return process
          }), newProcess],
        }));
      
        setCycles((prevCycles: ICycle[]) =>
          prevCycles.map((cycle) => {
            if (cycle.id === activeCycle.id) {
              return {
                ...cycle,
                cycleProcesses: [...cycle.cycleProcesses.map((process) => {
                  if(process.id === activeProcess?.id) {
                    return {
                      ...process, state: ProcessState.Ready
                    }
                  }
                  return process
                }), newProcess],
              };
            }
            return cycle;
          })
        );
      }
      }
    }
    
    else if(processCreationType === ProcessCreationType.random){
      generateMultipleProcesses(
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
    
    reset();
    setShowModal(false);
  };

  return (
    <dialog id="my_modal_3" className="modal modal-open">
      <div className="modal-box">
        <button
          onClick={() => setShowModal(!showModal)}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>

        <h1 className="text-lg text-green-600 font-semibold mb-4">
             Criação de processo(s)
        </h1>

        <div className="tabs">
            <a className={`tab tab-bordered ${tab === 1 && 'tab-active'}`} onClick={() => setTab(1)}>Parametrizado</a> 
            <a className={`tab tab-bordered ${tab === 2 && 'tab-active'}`} onClick={() => setTab(2)}>Aleatório</a> 
        </div>

        {tab === 1 ? (
          <form
            onSubmit={handleSubmit(data => onSubmit(data, ProcessCreationType.parametized))}
            className="flex flex-col items-center justify-around gap-4 max-w-[500px] p-4  min-h-[300px]"
          >
              <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="priority" className='text-sm'> Prioridade</label>
                <input
                  type="number"
                  placeholder="Proridade"
                  min={1}
                  max={15}
                  defaultValue={5}
                  {...register('priority', { required: true })}
                  className="input input-bordered input-info w-full max-w-xs"
                />
                {errors.priority && (
                  <span className="ml-2  text-red-500">Campo obrigatório</span>
                )}
              </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="runningTime" className='text-sm truncate'>Tempo de execução</label>
                  <input
                    type="number"
                    defaultValue={10}
                    min={1}
                    max={50}
                    placeholder="Tempo de execução"
                    {...register('runningTime', { required: true })}
                    className="input input-bordered input-info w-full max-w-xs"
                  />
                  {errors.runningTime && (
                    <span className="ml-2  text-red-500">Campo obrigatório</span>
                  )}
                </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="color" className='text-sm trucante'>Cor</label>
                <select
                  className="select select-info w-full max-w-xs"
                  // style={{ backgroundColor: selectedColor}}
                  {...register('color', { required: true })}
                >
                  <option disabled>Selecione a cor</option>
                  {Object.keys(colors).map((color: string, index) => (
                    <option
                      key={index}
                      value={colors[color as keyof typeof colors]}
                      style={{ backgroundColor: colors[color as keyof typeof colors]}}
                    >
                      {color}
                    </option>
                  ))}
                </select>
                {errors.color && (
                  <span className="ml-2 text-red-500">Campo obrigatório</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="color" className='text-sm max-h-[40px] h-full'>Tipo de processo </label>
                <select
                  className="select select-info w-full max-w-xs "
                  {...register('type', { required: true })}
                >
                  <option disabled>Selecione o tipo</option>
                  <option>{ProcessType.CpuBound}</option>
                  <option>{ProcessType.IOBound}</option>
                </select>
                {errors.type && (
                  <span className="text-red-500">Campo obrigatório</span>
                )}
              </div>
            </div>
                  
            <div className='flex flex-col items-center justify-center gap-6 w-full'>
              <div className='flex gap-3 items-center'>
                <span className='btn font-bold' onClick={handleDecreaseQuantity}> <Minus style={{color: 'red'}}/></span>
                {processesQuantity}
                <span className='btn font-bold' onClick={() => setProcessesQuantity(prev => prev + 1)}> <Plus style={{color: 'green'}}/></span>
              </div>

              <button type="submit" className="btn btn-success max-w-[250px] w-full">
                Criar
              </button>
            </div>
           
          </form>
           ) : (
            <form
            onSubmit={handleSubmit(data => onSubmit(data, ProcessCreationType.random))}
            className="flex flex-col items-center justify-around gap-4 max-w-[500px] p-4  min-h-[300px]"
            >
               <div className='flex flex-col gap-2'>
                <div className='flex gap-2'>
                  <h1>Quantidade de processos: </h1>
                  <span className='font-bold'>{processesQuantity}</span>
                </div>

                <input 
                    type="range" 
                    min={1} max="15" 
                    onChange={(e) => setProcessesQuantity(Number(e.target.value))} 
                    value={processesQuantity} 
                    className="range range-primary" 
                />
              </div>

              <button type="submit" className="btn btn-success max-w-xs w-full">
                Criar
              </button>
            </form>
          )}
      </div>
    </dialog>
  );
}
