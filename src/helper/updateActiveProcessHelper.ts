import { ProcessState } from "@/enums";
import { IProcess } from "@/types";
import { Dispatch, SetStateAction } from "react";

export const updateActiveProcessHelper = (
  setActiveProcess: Dispatch<SetStateAction<IProcess | null>>
) => {
  setActiveProcess((prevProcess: IProcess | null) => {
    if (prevProcess?.state === ProcessState.Finished || !prevProcess?.isActive) {

      return prevProcess;
    }

    if (prevProcess.cpuUsageTime >= prevProcess.runningTime) {

      return { ...prevProcess, state: ProcessState.Finished };

    } else {
      return { ...prevProcess, cpuUsageTime: prevProcess.cpuUsageTime + 1 };
    }
  });
};
