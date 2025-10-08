import { cn } from "@/lib/utils";
import React from "react";

interface KeyProps {
  char: string;
  isActive: boolean;
  className?: string;
  onCooldown?: boolean;
}

const Key = ({ char, isActive, className, onCooldown }: KeyProps) => (
  <div
    className={cn(
      "relative flex h-10 items-center justify-center overflow-hidden rounded-md border font-mono text-sm transition-all duration-150 ease-in-out",
      isActive
        ? "border-white/50 bg-white text-zinc-900 shadow-lg shadow-white/20 scale-105 -translate-y-1 font-bold"
        : "border-white/10 bg-black/20 text-zinc-300 backdrop-blur-sm",
      className
    )}
  >
    <div
      className={cn(
        "absolute top-0 bottom-0 right-0 bg-primary/40",
        onCooldown ? "w-full animate-cooldown-wipe" : "w-0"
      )}
    />
    <span className="relative z-10">{char}</span>
  </div>
);

interface ControlsProps {
  keys: {
    w: boolean;
    a: boolean;
    s: boolean;
    d: boolean;
    shift: boolean;
    h: boolean;
    l: boolean;
    r: boolean;
  };
  isHornOnCooldown: boolean;
}

export const Controls = ({ keys, isHornOnCooldown }: ControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-2 opacity-90">
      <div className="flex flex-col items-center gap-1">
        <div className="grid w-fit grid-cols-3 gap-1">
          <div />
          <Key char="W" isActive={keys.w} className="w-10" />
          <div />
          <Key char="A" isActive={keys.a} className="w-10" />
          <Key char="S" isActive={keys.s} className="w-10" />
          <Key char="D" isActive={keys.d} className="w-10" />
        </div>
        <div className="flex w-full items-center gap-1">
          <Key
            char="Shift"
            isActive={keys.shift}
            className="flex-grow text-xs px-4"
          />
          <Key
            char="H"
            isActive={keys.h}
            className="w-10"
            onCooldown={isHornOnCooldown}
          />
          <Key char="L" isActive={keys.l} className="w-10" />
          <Key char="R" isActive={keys.r} className="w-10" />
        </div>
      </div>
    </div>
  );
};
