import { ProcessState } from '@/enums';
import { IProcess } from '@/types';
import React, { useState } from 'react'

type Props = {
    process: IProcess
}

export default function ProcessArrival({process}: Props) {

  return (
    <div>
       {process.hasArrived ? (
            <div>
                <td
                  className={`
                  ${
                    process?.state === ProcessState.Ready
                      ? 'text-blue-500'
                      : process?.state === ProcessState.Running
                      ? 'text-green-500'
                      : process?.state === ProcessState.Finished
                      ? 'text-red-500'
                      : 'text-gray-500'
                  } 
                  `}
                >
                  {process.state}
                </td>
            </div>
       ): (
            <div>
                <td>
                    <span className="loading loading-spinner text-primary"></span>
                </td>
            </div>
       )}
    </div>
  )
}