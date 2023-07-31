'use client';
import { useState } from 'react';
import { IProcess } from '../types';
import Process from '@/components/Process/Process';

export default function Home() {
  const [processes, setProcesses] = useState<IProcess | null>(null);

  return (
    <div>
      Hello world
      <Process />
    </div>
  );
}
