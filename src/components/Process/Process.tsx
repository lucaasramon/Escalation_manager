"use client";
import React, { useState } from "react";
import CreateProcess from "./components/CreateProcess";
import { IProcess } from "@/types";

type Props = {};

export default function Process({}: Props) {
  const [processes, setProcesses] = useState<IProcess[]>([]);

  console.log(processes);

  return (
    <div>
      <CreateProcess setProcesses={setProcesses} />
    </div>
  );
}
