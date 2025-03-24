'use client';
import { useState } from 'react';

interface Props {
  maxSelection: number;
  options: string[][];
}

export default function DownloadGuideSelection({
  maxSelection,
  options,
}: Props) {
  const [selection, setSelection] = useState<string[]>([]);

  const toggleOption = option => {
    if (selection.includes(option)) {
      setSelection(selection.filter(i => i !== option));
    } else if (selection.length < maxSelection) {
      setSelection([...selection, option]);
    }
  };

  return (
    <div className="page-wrap flex justify-center items-center pt-48 pb-12">
      <div className="max-w-screen-sm w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Select up to {maxSelection} guides
        </h2>
        <div className="space-y-2">
          {options
            .sort((a, b) => a[1].localeCompare(b[1]))
            .map(([key, name]) => (
              <button
                key={key}
                onClick={() => toggleOption(key)}
                className={`w-full p-2 rounded-md transition-colors ${
                  selection.includes(key)
                    ? 'btn bg-primary-500 hover:bg-primary-500 text-white'
                    : 'btn'
                } ${
                  selection.length >= maxSelection && !selection.includes(key)
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                disabled={
                  selection.length >= maxSelection && !selection.includes(key)
                }>
                {name}
              </button>
            ))}
        </div>
        {selection.length === maxSelection && (
          <button
            className="w-full btn mt-8"
            type="button"
            onClick={() => {
              const currentURL = new URL(window.location.href);
              const searchParams = new URLSearchParams(currentURL.search);
              searchParams.set('guides_choice', selection.join(','));
              currentURL.search = searchParams.toString();
              window.location.href = currentURL.toString();
            }}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
