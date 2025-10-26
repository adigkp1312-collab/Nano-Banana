
import React from 'react';

const WandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M15 4V2" />
        <path d="M15 10V8" />
        <path d="M12.5 6.5L14 5" />
        <path d="M6 15l-2 2 3.5 3.5 2-2" />
        <path d="m21.5 2.5-2 2" />
        <path d="M3.5 3.5L2 2" />
        <path d="M15 22v-2" />
        <path d="M8.5 8.5l-1-1" />
        <path d="M10 15H8" />
        <path d="M6.5 12.5L5 14" />
        <path d="M19 12h2" />
        <path d="M17.5 17.5l1 1" />
        <path d="M22 15h-2" />
        <path d="M12 19.5V18" />
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-gray-700">
      <div className="w-full mx-auto flex items-center gap-3">
        <WandIcon className="w-8 h-8 text-indigo-400" />
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Whisk Tool <span className="text-gray-400">/ AI Image Generator</span>
        </h1>
      </div>
    </header>
  );
};
