import { useProcessesContext } from '@/context/context';
import { Cpu } from '@phosphor-icons/react'
import React from 'react'

type Props = {}

export default function CpuComponent({}: Props) {

    const {
        activeProcess,
      } = useProcessesContext();

  return (
    <div className="flex items-center flex-col gap-2 p-4 shadow-lg rounded-lg h-[200px] w-full">
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
  )
}