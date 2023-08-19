import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { EscalationAlgorithm } from '@/enums';

type EscalationAlgorithmProps = {
  setActualAlgorithm: React.Dispatch<
    React.SetStateAction<EscalationAlgorithm | undefined>
  >;
};

export default function SelectEscalationAlgorithm({
  setActualAlgorithm,
}: EscalationAlgorithmProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const selectedAlgorithm = watch('algorithm', '');

  useEffect(() => {
    setActualAlgorithm(selectedAlgorithm);
  }, [selectedAlgorithm, setActualAlgorithm]);

  return (
    <form className="flex flex-col items-center gap-4 max-w-[500px]">
      <div className="flex flex-col gap-2">
        <select
          className="select select-info w-full max-w-xs"
          {...register('algorithm', { required: true })}
        >
          <option disabled>Selecione a algoritmo</option>
          {Object.keys(EscalationAlgorithm).map((algorithm, index) => (
            <option
              key={index}
              value={
                EscalationAlgorithm[
                  algorithm as keyof typeof EscalationAlgorithm
                ]
              }
            >
              {algorithm}
            </option>
          ))}
        </select>
        {errors.color && (
          <span className="ml-2 text-red-500">Campo obrigatório</span>
        )}
      </div>
    </form>
  );
}
