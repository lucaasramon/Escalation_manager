'use client';
import { ProcessState, ProcessType } from '@/enums';
import { IProcess } from '@/types';
import { generateUniqueNumber } from '@/utils/idGenerator';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type CreateProcessProps = {
  setProcesses: React.Dispatch<React.SetStateAction<IProcess[]>>;
};

export default function CreateProcess({ setProcesses }: CreateProcessProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<IProcess> = (data) => {
    console.log(data);

    const processData: IProcess = {
      id: generateUniqueNumber(1000, 9999),
      priority: data.priority,
      color: data.color,
      type: data.type,
      state: ProcessState.Waiting,
      timeCreated: Date.now(),
    };

    setProcesses((prevState: IProcess[]) => [...prevState, processData]);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center gap-4 max-w-[500px] p-4"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-lg text-green-600 font-semibold">
          Criar novo processo
        </h1>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Proridade"
            {...register('priority', { required: true })}
            className="input input-bordered input-info w-full max-w-xs"
          />
          {errors.priority && (
            <span className="ml-2  text-red-500">Campo obrigatório</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Cor"
            {...register('color', { required: true })}
            className="input input-bordered input-info w-full max-w-xs"
          />
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
  );
}
