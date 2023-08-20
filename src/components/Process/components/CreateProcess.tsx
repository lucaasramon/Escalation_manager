'use client';
import {
  EscalationAlgorithm,
  ProcessState,
  ProcessType,
  colors,
} from '@/enums';
import { IProcess } from '@/types';
import { generateUniqueNumber } from '@/utils/idGenerator';
import React from 'react';
import { useForm } from 'react-hook-form';

type CreateProcessProps = {
  setProcesses: React.Dispatch<React.SetStateAction<IProcess[]>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  actualAlgorithm?: EscalationAlgorithm;
};

export default function CreateProcess({
  setProcesses,
  setShowModal,
  showModal,
  actualAlgorithm,
}: CreateProcessProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit: any = (data: IProcess) => {
    const processData: IProcess = {
      id: generateUniqueNumber(1000, 9999),
      priority: Number(data.priority),
      color: data.color,
      type: data.type,
      runningTime: Number(data.runningTime),
      cpuUsageTime: 0,
      waitingTime: 0,
      state: ProcessState.Ready,
    };

    setProcesses((prevState: IProcess[]) => [...prevState, processData]);
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-4 max-w-[500px] p-4"
        >
          <h1 className="text-lg text-green-600 font-semibold">
            Criar novo processo
          </h1>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <input
                type="number"
                placeholder="Proridade"
                min={1}
                max={15}
                {...register('priority', { required: true })}
                className="input input-bordered input-info w-full max-w-xs"
              />
              {errors.priority && (
                <span className="ml-2  text-red-500">Campo obrigatório</span>
              )}
            </div>

            {actualAlgorithm !== EscalationAlgorithm.RR && (
              <div className="flex flex-col gap-2">
                <input
                  type="number"
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
            )}

            <div className="flex flex-col gap-2">
              <select
                className="select select-info w-full max-w-xs"
                {...register('color', { required: true })}
              >
                <option disabled>Selecione a cor</option>
                {Object.keys(colors).map((color: string, index) => (
                  <option
                    key={index}
                    value={colors[color as keyof typeof colors]}
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

          <button type="submit" className="btn btn-success">
            Finalizar
          </button>
        </form>
      </div>
    </dialog>
  );
}
