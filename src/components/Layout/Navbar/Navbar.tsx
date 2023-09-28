
import React from 'react';

type Props = {};

export default function Navbar({}: Props) {

  return (
    <div className="navbar bg-base-300 flex items-center justify-center h-[10rem]">
      <a className="btn btn-ghost normal-case text-center text-3xl">SO Helper</a>
    </div>
  );
}
