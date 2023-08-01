'use client';
import React, { useState } from 'react';
import CreateProcess from './components/CreateProcess';
import { IProcess } from '@/types';
import ProcessTable from './components/ProcessTable';

type Props = {};

export default function Process({}: Props) {
  const [processes, setProcesses] = useState<IProcess[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  console.log(showModal);

  return (
    <div>
      <button
        className="btn btn-primary mt-4"
        onClick={() => setShowModal(!showModal)}
      >
        Process +
      </button>
      {showModal && (
        <dialog id="my_modal_3" className="modal modal-open">
          <div className="modal-box">
            <button
              onClick={() => setShowModal(!showModal)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            <CreateProcess setProcesses={setProcesses} />
          </div>
        </dialog>
      )}

      <ProcessTable processes={processes} />
    </div>
  );
}
