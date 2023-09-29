import React from 'react';

type QuantumProps = {
  setQuantum: React.Dispatch<React.SetStateAction<number | undefined>>;
  quantum: number | undefined;
};

export default function Quantum({ setQuantum, quantum }: QuantumProps) {
  const handleChangeQuantum = (value: string) => {
    const handledValue = Number(value);
    setQuantum(handledValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="w-full max-w-[250px]">
        <span className='font-bold underline'>Quantum</span>
        <input
          type="number"
          defaultValue={quantum}
          name="quantum"
          placeholder="Defina o quantum"
          className="input input-bordered input-info w-full max-w-xs mt-2"
          onChange={(e) => handleChangeQuantum(e.target.value)}
        />
      </label>
    </div>
  );
}
