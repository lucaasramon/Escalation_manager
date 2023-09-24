export enum ProcessType {
  CpuBound = 'CPU-Bound',
  IOBound = 'I/O-Bound',
}

export enum ProcessState {
  Ready = 'pronto',
  Running = 'executando',
  Waiting = 'esperando',
  Finished = 'finalizado',
}

export enum CycleState {
  Active = 'ativo',
  Finished = 'finalizado',
}

export enum PreemptiveEscalationAlgorithm {
  Priority = 'Priority',
  RR = 'Round Robin',
}

export enum NonPreemptiveEscalationAlgorithm {
  FIFO = 'First In First Out',
  SJF = 'Shortest Job First',
}

export enum colors {
  Preto = '#000000',
  Branco = '#ffffff',
  Cinza = '#808080',
  Vermelho = '#ff0000',
  Laranja = '#ffa500',
  Amarelo = '#ffff00',
  Verde = '#008000',
  Azul = '#0000ff',
  Roxo = '#800080',
  Rosa = '#ffc0cb',
  Lima = '#00ff00',
  Ciano = '#00ffff',
  Céu = '#87ceeb',
  Fúcsia = '#ff00ff',
  Âmbar = '#ffbf00',
  Esmeralda = '#50c878',
  Índigo = '#4b0082',
  Violeta = '#9400d3',
  Marrom = '#a52a2a',
  Vinho = '#800000',
  Marinho = '#000080',
  Água = '#00ffff',
  Magenta = '#ff00aa',
  Turquesa = '#40e0d0',
  Dourado = '#ffd700',
  Lavanda = '#e6e6fa',
  Hortelã = '#98ff98',
}
