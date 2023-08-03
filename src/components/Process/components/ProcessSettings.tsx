import React from 'react';

type ProcessSettingsProps = {
  setQuantum: React.Dispatch<React.SetStateAction<number | undefined>>;
  quantum: number | undefined;
};

export default function ProcessSettings({
  setQuantum,
  quantum,
}: ProcessSettingsProps) {
  const handleChangeQuantum = (value: string) => {
    const handledValue = Number(value);
    setQuantum(handledValue);
  };

  return (
    <div>
      <h2>Fatia de tempo</h2>
      <input
        type="range"
        min={0}
        value={quantum}
        max="20"
        className="range p-2"
        step="5"
        onChange={(e) => handleChangeQuantum(e.target.value)}
      />
      <div className="w-full flex justify-between text-xs px-2">
        <span>0</span>
        <span>5</span>
        <span>10</span>
        <span>15</span>
        <span>20</span>
      </div>
    </div>
  );
}
