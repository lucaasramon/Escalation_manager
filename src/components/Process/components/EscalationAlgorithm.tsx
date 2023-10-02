import React, { useEffect, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { PreemptiveEscalationAlgorithm, NonPreemptiveEscalationAlgorithm } from '@/enums';
import { useProcessesContext } from '@/context/context';
import { ArrowDown, ArrowUp, GearSix, X } from '@phosphor-icons/react';
import Quantum from './Quantum';

export default function SelectEscalationAlgorithm() {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cycleType: 'nonPreemptive',
      algorithm: undefined,
      color: ''
    }
  });
  
  const { activeProcess, setIsPreemptive, setCurrentAlgorithm, isPreemptive, quantum, setQuantum, currentAlgorithm} = useProcessesContext();
  const [showModal, setShowModal] = useState<boolean>(false);

  const selectedAlgorithm = watch('algorithm', undefined);

  const EscalationAlgorithms = [
    {name: 'Prioridade', value: PreemptiveEscalationAlgorithm.Priority, isPreemptive: true},
    {name: 'Round Robin', value: PreemptiveEscalationAlgorithm.RR, isPreemptive: true},
    {name: 'FIFO', value: NonPreemptiveEscalationAlgorithm.FIFO, isPreemptive: false},
    {name: 'SJF', value: NonPreemptiveEscalationAlgorithm.SJF, isPreemptive: false},
  ]

  useEffect(() => {
    setCurrentAlgorithm(selectedAlgorithm);
  }, [selectedAlgorithm, setCurrentAlgorithm]);

  useEffect(() => {
    setCurrentAlgorithm(undefined);
  }, [isPreemptive]);

  return (
 
  <div>
    <button className="btn btn-primary flex-nowrap max-w-[150px] w-full text-[10px]" onClick={()=> setShowModal(true)}> Configuração <GearSix size={28} /></button>
    
    {showModal && (
       <dialog id="my_modal_2" className={`modal ${showModal && 'modal-open'}`}>
       <div className="modal-box flex flex-col items-center gap-6">
         <form className="flex flex-col items-center gap-4 max-w-[500px]">
           <div className="flex flex-col gap-2">
             
             <div className='flex justify-between'>
               <h1 className='text-green-500 font-bold mb-2 text-xl'>Configuração</h1>
               <X weight='bold' color='white' className='cursor-pointer' size={25} onClick={()=> setShowModal(false)}></X>
             </div>
 
             <span className='font-bold underline'>Tipo de sistema</span>
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
 
             <div className="flex gap-2 items-center mb-2">
               <input 
                 {...register('cycleType')}
                 type="radio"
                 className='radio'
                 value={'preemptive'}
                 onChange={() =>  setIsPreemptive(true)}
               />
               <label>Preemptivo</label>
             </div>
             
             <span className='font-bold underline'>Algoritmo de escalonamento</span>
              <select
                disabled={!!activeProcess}
                value={selectedAlgorithm}
                className="select select-info w-full max-w-xs"
                {...register('algorithm', { required: true })}
              >
                 <option hidden className="text-gray-600" value={'Selecione o algoritmo'}>
                  Selecione o algoritmo
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
 
         <div>
           {currentAlgorithm === PreemptiveEscalationAlgorithm.RR && isPreemptive && (
             <Quantum setQuantum={setQuantum} quantum={quantum} />
           )}
         </div>
         <button onClick={() => setShowModal(false)} className='btn btn-primary text-white font-bold'>Pronto</button>
       </div>
     </dialog>
    )}
</div>
  );
}
