import { motion } from "framer-motion";

interface CarProps {
  x: number;
  y: number;
  angle: number;
  keys: {
    w: boolean;
    s: boolean;
    shift: boolean;
    h: boolean;
    l: boolean;
    r: boolean;
  };
  areLightsOn: boolean;
}

export const Car = ({ x, y, angle, keys, areLightsOn }: CarProps) => {
  const isMovingForward = keys.w;
  const isReversing = keys.s;
  const isNitro = keys.shift;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%)`,
      }}
      animate={{ rotate: angle }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="relative h-28 w-16">
        {areLightsOn && (
          <>
            <div
              className={`absolute left-[-22px] top-[-40px] h-20 w-16 origin-bottom rounded-full bg-gradient-to-t from-yellow-300/30 to-transparent opacity-70 transition-transform duration-300 ${
                isMovingForward ? "scale-y-125" : ""
              }`}
              style={{ clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0 100%)" }}
            />
            <div
              className={`absolute right-[-22px] top-[-40px] h-20 w-16 origin-bottom rounded-full bg-gradient-to-t from-yellow-300/30 to-transparent opacity-70 transition-transform duration-300 ${
                isMovingForward ? "scale-y-125" : ""
              }`}
              style={{ clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0 100%)" }}
            />
          </>
        )}

        <div className="h-full w-full rounded-xl border-2 border-black/20 bg-gradient-to-b from-red-600 to-red-800 shadow-xl"></div>
        <div className="absolute left-1/2 top-4 h-9 w-12 -translate-x-1/2 rounded-t-lg border-x border-t border-black/20 bg-gradient-to-b from-zinc-700 to-black opacity-80"></div>
        <div className="absolute left-1/2 top-3 h-1 w-8 -translate-x-1/2 rounded-full bg-black/20"></div>

        <div
          className={`absolute left-1.5 top-2 h-3 w-4 rounded-full bg-zinc-400 transition-all duration-300 ${
            areLightsOn ? "bg-yellow-200" : ""
          } ${
            areLightsOn && isMovingForward
              ? "shadow-[0_0_25px_8px_rgba(252,237,167,0.8)]"
              : areLightsOn
              ? "shadow-[0_0_15px_4px_rgba(252,237,167,0.6)]"
              : ""
          }`}
        />
        <div
          className={`absolute right-1.5 top-2 h-3 w-4 rounded-full bg-zinc-400 transition-all duration-300 ${
            areLightsOn ? "bg-yellow-200" : ""
          } ${
            areLightsOn && isMovingForward
              ? "shadow-[0_0_25px_8px_rgba(252,237,167,0.8)]"
              : areLightsOn
              ? "shadow-[0_0_15px_4px_rgba(252,237,167,0.6)]"
              : ""
          }`}
        />

        <div
          className={`absolute bottom-2 left-1.5 h-3 w-5 rounded-sm bg-red-900/80 transition-all duration-300 ${
            isReversing
              ? "bg-red-500 shadow-[0_0_10px_3px_rgba(255,0,0,0.7)]"
              : ""
          }`}
        />
        <div
          className={`absolute bottom-2 right-1.5 h-3 w-5 rounded-sm bg-red-900/80 transition-all duration-300 ${
            isReversing
              ? "bg-red-500 shadow-[0_0_10px_3px_rgba(255,0,0,0.7)]"
              : ""
          }`}
        />

        <div className="absolute bottom-6 left-[-2px] h-8 w-2 rounded-r-full bg-black/40"></div>
        <div className="absolute bottom-6 right-[-2px] h-8 w-2 rounded-l-full bg-black/40"></div>
        <div className="absolute top-6 left-[-2px] h-6 w-2 rounded-r-full bg-black/40"></div>
        <div className="absolute top-6 right-[-2px] h-6 w-2 rounded-l-full bg-black/40"></div>

        {isNitro && (
          <>
            <div className="absolute bottom-[-14px] left-[18px] h-14 w-5 origin-bottom animate-pulse rounded-t-full bg-orange-400 blur-sm"></div>
            <div className="absolute bottom-[-14px] right-[18px] h-14 w-5 origin-bottom animate-pulse rounded-t-full bg-orange-400 blur-sm"></div>
            <div className="absolute bottom-[-10px] left-[18px] h-10 w-4 origin-bottom animate-pulse rounded-t-full bg-gradient-to-t from-sky-400 to-white"></div>
            <div className="absolute bottom-[-10px] right-[18px] h-10 w-4 origin-bottom animate-pulse rounded-t-full bg-gradient-to-t from-sky-400 to-white"></div>
          </>
        )}
      </div>
    </motion.div>
  );
};
