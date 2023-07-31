'use client';
import React, { useState } from 'react';
import CreateProcess from './components/CreateProcess';
import { IProcess } from '@/types';

type Props = {};

export default function Process({}: Props) {
  const [process, setProcess] = useState<IProcess | null>(null);

  return (
    <div>
      <CreateProcess />
    </div>
  );
}
