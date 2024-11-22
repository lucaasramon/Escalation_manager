import {ICycle, IProcess } from "@/types";

export const shouldInitializeProcess = (
  process: IProcess,
  activeCycle: ICycle
): boolean => {
    return activeCycle.duration >= process.arrivalTime
  }
