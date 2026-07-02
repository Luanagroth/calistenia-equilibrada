"use client";

import { Star } from "lucide-react";
import { useState } from "react";

type RatingOption = {
  value: number;
  label: string;
};

type RatingStarsProps = {
  defaultValue: number | null;
  name: string;
  options: RatingOption[];
  title: string;
};

export function RatingStars({
  defaultValue,
  name,
  options,
  title,
}: RatingStarsProps) {
  const [value, setValue] = useState<number | null>(defaultValue);

  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-300">{title}</p>
        <p className="text-xs font-medium text-yellow-300">
          {selectedLabel ?? "Selecione um nivel"}
        </p>
      </div>

      <input type="hidden" name={name} value={value ?? ""} />

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value !== null && option.value <= value;

          return (
            <button
              key={`${name}-${option.value}`}
              type="button"
              onClick={() => setValue(option.value)}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left transition hover:border-yellow-400/30 hover:bg-yellow-400/[0.06]"
              aria-label={`${title}: ${option.label}`}
              aria-pressed={value === option.value}
            >
              <Star
                className={`h-5 w-5 ${
                  active ? "fill-yellow-400 text-yellow-400" : "text-slate-500"
                }`}
              />
              <span className="text-xs text-slate-300">{option.value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
