import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] py-10 bg-surface/50 backdrop-blur-xl rounded-2xl border border-dashed border-white/20">
      <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-brand-yellow"></div>
      <p className="mt-4 text-text-secondary text-lg">Generating Prompts...</p>
    </div>
  );
};