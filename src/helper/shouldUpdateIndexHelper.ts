
//Função responsável por alternar os processos da fila baseado no quantum
export const shouldUpdateIndexHelper = (
  count: number,
  quantum: number | undefined,
) => {
    const shouldUpdateIndex = count >= quantum!
    return shouldUpdateIndex
}
