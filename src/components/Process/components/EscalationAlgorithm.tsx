import React, { useEffect, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { PreemptiveEscalationAlgorithm, NonPreemptiveEscalationAlgorithm } from '@/enums';
import { useProcessesContext } from '@/context/context';
import { ArrowDown, ArrowUp } from '@phosphor-icons/react';

export default function SelectEscalationAlgorithm() {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cycleType: 'nonPreemptive',
      algorithm: '',
      color: ''
    }
  });
  
  const { activeProcess, setIsPreemptive, setCurrentAlgorithm, isPreemptive} = useProcessesContext();
  const [arrow, setArrow] = useState<boolean>(false);

  const selectedAlgorithm = watch('algorithm', '');
  const selectedCycleType = watch('cycleType')

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
  <details className="dropdown bg-base-200">
    <summary className="btn btn-primary text-[10px] flex-nowrap max-w-[150px]" onClick={() => setArrow(!arrow)}>Configuração
    {!arrow ? <ArrowDown size={28} /> : <ArrowUp size={28} />}
    </summary>
    <div className="p-2 shadow menu mt-2 dropdown-content z-[1] bg-base-100 rounded-box max-w-[200px] w-full gap-2"> 
    <form className="flex flex-col items-center gap-4 max-w-[500px]">
      <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <input
          {...register('cycleType')}
          type="radio"  
          className='radio'
          value={'nonPreemptive'}
          onChange={() =>  setIsPreemptive(false)}
        />
        <label>Não preemptivo</label>  
      </div>

      <div className="flex gap-2 items-center">
        <input 
          {...register('cycleType')}
          type="radio"
          className='radio'
          value={'preemptive'}
          onChange={() =>  setIsPreemptive(true)}
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
