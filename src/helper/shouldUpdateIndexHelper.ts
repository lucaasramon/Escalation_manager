import { CycleState, PreemptiveEscalationAlgorithm, ProcessState } from '@/enums';
import { ICycle, IProcess } from '@/types';
import { Dispatch, SetStateAction } from 'react';

//Função responsável por alternar os processos da fila baseado no quantum
export const shouldUpdateIndexHelper = (
  activeCycle: ICycle | undefined,
  count: number,
  quantum: number | undefined
) => {

  //Round Robin
  if(activeCycle?.algorithm === PreemptiveEscalationAlgorithm.RR) {
      const shouldUpdateIndex = count >= quantum!
      return shouldUpdateIndex
  }
}
