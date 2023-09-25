import React, { useEffect } from 'react';
import { useForm, Controller, useController } from 'react-hook-form';
import { PreemptiveEscalationAlgorithm, NonPreemptiveEscalationAlgorithm } from '@/enums';
import { useProcessesContext } from '@/context/context';

export default function SelectEscalationAlgorithm() {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cycleType: 0,
      algorithm: '',
      color: ''
    }
  });

  const { activeProcess, setIsPreemptive, setCurrentAlgorithm, isPreemptive} = useProcessesContext();

  const { field } = useController({
    name: "cycleType", 
    control,
    rules: {
      validate: (value) => value === 0 || value === 1
    },
  });

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
        <input
          type="radio"  
          className='radio'
          {...field} 
          value={0}
          onChange={() => setIsPreemptive(false)}
        />
        <label>Não preemptivo</label>  
      </div>

      <div className="flex gap-2 items-center">
        <input 
          type="radio"
          className='radio'
          {...field}
          value={1}
          onChange={() => setIsPreemptive(true)}
        />
        <label>Preemptivo</label>
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
