import React from "react";

interface LoaderProps {
  nestedStyles?: string;
}

export default function Loader({ nestedStyles = "" }: LoaderProps) {
  return (
    <div className={`inset-0 flex items-center justify-center ${nestedStyles}`}>
      <div className="w-[65px] h-[65px] border-8 border-[#ee9b00a6] rounded-full relative">
        <span className="block bg-[#ee9b00] absolute w-[6px] h-[22px] top-[24.5px] left-[21px] origin-top animate-spin-1.2s rounded-full"></span>
        <span className="block bg-[#ee9b00] absolute w-[6px] h-[17px] top-[24.5px] left-[21px] origin-top animate-spin-4s rounded-full"></span>
        <span className="block bg-[#ee9b00] absolute w-[10px] h-[10px] top-[19px] left-[19px] rounded-full"></span>
      </div>
    </div>
  );
}
