import { useProcessesContext } from '@/context/context';
import { ArrowDown, ArrowUp, Plus } from '@phosphor-icons/react'
import React, { useState } from 'react'
import CreateProcess from './CreateProcess';

type Props = {}

export default function ProcessCreation({}: Props) {
  const {quantum} = useProcessesContext();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [arrow, setArrow] = useState<boolean>(false);

  const handleClick = () => {
    setShowModal(!showModal)
    setArrow(!arrow)
  }

  return (
    <div className='max-w-[150px] w-full'>
        <summary className="btn btn-primary text-xs flex-nowrap w-full" onClick={handleClick}>
        Processo <Plus size={28}/>
        </summary>

        {showModal && (
            <CreateProcess
            setShowModal={setShowModal}
            showModal={showModal}
            quantum={quantum}
            />
        )}
    </div>
  )
}