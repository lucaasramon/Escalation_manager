import { useProcessesContext } from '@/context/context';
import { ProcessType } from '@/enums';
import { Cpu, Keyboard } from '@phosphor-icons/react'
import React from 'react'

type Props = {}

export default function CpuComponent({}: Props) {

    const {
        activeProcess,
      } = useProcessesContext();

  return (
    <div className="bdarkgray flex items-center flex-col gap-2 p-4 shadow-lg rounded-lg h-[200px] w-full">

      {activeProcess?.type === ProcessType.CpuBound ? (
        <Cpu
          size={50}
        />
      ) :  (
        <Keyboard 
          size={50}
        />
      )}

    {activeProcess ? (
      <div className="flex flex-col p-4 items-center">
        <div className="flex p-2 gap-2 items-center">
          <h2 className="text-green-500 text-lg font-semibold">Executando...</h2>
        </div>

        <div className="flex gap-1 items-center">
          <h1
            style={{ backgroundColor: activeProcess?.color }}
            className={`rounded-full h-2 w-2 inline-block animate-ping`}
          />
          <h1 className='text-lg font-semibold'>{activeProcess?.id}</h1>
        </div>
      </div>
    ) : 
    (
      <div className="flex flex-col p-4 items-center">
        <div className="flex p-2 gap-2 items-center">
          <h2 className="text-yellow-500 text-lg font-semibold">Esperando processo</h2>
        </div>
      </div>
    )
    }
  </div>
  )
}