'use client';
import { ProcessState, ProcessType } from '@/enums';
import { IProcess } from '@/types';
import { generateUniqueNumber } from '@/utils/idGenerator';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

export default function CreateProcess() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<IProcess> = (data) => {
    const processData: IProcess = {
      id: generateUniqueNumber(1000, 9999),
      priority: data.priority,
      color: data.color,
      type: data.type,
      state: ProcessState.Waiting,
      timeCreated: Date.now(),
    };

    console.log(processData);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <input
          type="text"
          placeholder="Proridade"
          {...register('priority', { required: true })}
          className="input input-bordered input-info w-full max-w-xs"
        />
        {errors.priority && <span>This field is required</span>}
      </div>

      <div>
        <input
          type="text"
          placeholder="Type here"
          {...register('color', { required: true })}
          className="input input-bordered input-info w-full max-w-xs"
        />
        {errors.color && <span>This field is required</span>}
      </div>

      <div>
        <select
          className="select select-info w-full max-w-xs "
          {...register('type', { required: true })}
        >
          <option disabled selected>
            Selecione o tipo
          </option>
          <option>{ProcessType.CpuBound}</option>
          <option>{ProcessType.IOBound}</option>
        </select>
        {errors.type && <span>This field is required</span>}
      </div>

      {/* <div>
        <input
          type="text"
          placeholder="Type here"
          {...(register('color'), { required: true })}
          className="input input-bordered input-info w-full max-w-xs"
        />
        {errors.color && <span>This field is required</span>}
      </div> */}

      <input type="submit" />
    </form>
  );
}
