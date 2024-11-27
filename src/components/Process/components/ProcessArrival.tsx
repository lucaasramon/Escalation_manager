import { ProcessState } from '@/enums';
import { IProcess } from '@/types';

type Props = {
  process: IProcess;
};

export default function ProcessArrival({ process }: Props) {
  return (
    <>
      {process.hasArrived ? (
        <div
          className={`${
            process?.state === ProcessState.Ready
              ? 'text-blue-500'
              : process?.state === ProcessState.Running
              ? 'text-yellow-500'
              : process?.state === ProcessState.Finished
              ? 'text-green-500'
              : process?.state === ProcessState.Waiting
              ? 'text-gray-500' 
              : process?.state === ProcessState.roundRobin
              ? 'loading loading-spinner text-primary'
              : 'text-gray-500'
          }`}
        >
          {process.state}
        </div>
      ) : (
        <div
        className={`${
          process?.state === ProcessState.Ready
            ? 'text-blue-500'
            : 'text-gray-500'
        }`}>
          {process.state ? process.state: <span className="loading loading-spinner text-primary"></span>}
          
        </div>  
      )}
    </>
  );
}
