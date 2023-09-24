import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { PreemptiveEscalationAlgorithm, NonPreemptiveEscalationAlgorithm } from '@/enums';
import { useProcessesContext } from '@/context/context';

export default function SelectEscalationAlgorithm() {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const { activeProcess, setIsPreemptive, setCurrentAlgorithm, isPreemptive} = useProcessesContext();

  const selectedAlgorithm = watch('algorithm', '');

  const EscalationAlgorithms = [
    {name: 'Prioridade', value: PreemptiveEscalationAlgorithm.Priority, isPreemptive: true},
    {name: 'Round Robin', value: PreemptiveEscalationAlgorithm.RR, isPreemptive: true},
    {name: 'FIFO', value: NonPreemptiveEscalationAlgorithm.FIFO, isPreemptive: false},
    {name: 'SJF', value: NonPreemptiveEscalationAlgorithm.SJF, isPreemptive: false},
  ]

  useEffect(() => {
    setCurrentAlgorithm(selectedAlgorithm);
  }, [selectedAlgorithm, setCurrentAlgorithm]);

  return (
    <details className="collapse bg-base-200">
  <summary className="collapse-title text-xl font-medium">Algoritimos de escalonamento</summary>
  <div className="collapse-content"> 
  <form className="flex flex-col items-center gap-4 max-w-[500px]">
      <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <input type="radio" {...register('systemsType', { required: true })} onChange={() => setIsPreemptive(false)} className="radio radio-primary" />
          <label className="label cursor-pointer">
            Não preemptivo
          </label>
        </div>

        <div className="flex gap-2 items-center">
        <input type="radio" {...register('systemsType', { required: true })} onChange={() => setIsPreemptive(true)} className="radio radio-primary" />
          <label className="label cursor-pointer">
            Preemptivo
          </label>
        </div>
        <select
          disabled={!!activeProcess}
          value={selectedAlgorithm}
          className="select select-info w-full max-w-xs"
          {...register('algorithm', { required: true })}
        >
          <option hidden className="text-gray-600">
            Selecione o tipo de algoritmo
          </option>

          {isPreemptive ? EscalationAlgorithms.filter((algorithm) => algorithm.isPreemptive).map((algorithm, index) => (
            <option value={algorithm.value} key={index}>
              {algorithm.name}
            </option>
          )) : 
          EscalationAlgorithms.filter((algorithm) => !algorithm.isPreemptive).map((algorithm, index) => (
            <option value={algorithm.value} key={index}>
              {algorithm.name}
            </option>))
          }
          
        </select>
        {errors.color && (
          <span className="ml-2 text-red-500">Campo obrigatório</span>
        )}
      </div>
    </form>
  </div>
</details>
   
  );
}
