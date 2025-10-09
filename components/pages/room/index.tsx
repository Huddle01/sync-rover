"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  usePeerIds,
  useRoom,
  useDataMessage,
  useLocalPeer,
} from "@huddle01/react/hooks";
import { getAccessToken } from "@/lib/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Car } from "./Car";
import { Controls } from "./Controls";
import { HostVideoStream } from "./HostVideoStream";
import { Users, Share2, LogOut, Copy, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { Role } from "@huddle01/server-sdk/auth";

interface CarState {
  x: number;
  y: number;
  angle: number;
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
  areLightsOn: boolean;
}

const Room = ({ roomId }: { roomId: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isHost = searchParams.get("host") === "true";

  const { joinRoom, leaveRoom, state } = useRoom();
  const { peerId: localPeerId, role } = useLocalPeer();
  const { peerIds } = usePeerIds();
  const { peerIds: hostPeerIds } = usePeerIds({ roles: [Role.HOST] });

  const [carState, setCarState] = useState<CarState>({
    x: 50,
    y: 50,
    angle: 0,
    keys: {
      w: false,
      a: false,
      s: false,
      d: false,
      shift: false,
      h: false,
      l: false,
      r: false,
    },
    areLightsOn: true,
  });
  const [hostPeerId, setHostPeerId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isRoomIdCopied, setIsRoomIdCopied] = useState(false);
  const [isHornOnCooldown, setIsHornOnCooldown] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const keysPressed = useRef(carState.keys);
  const carStateRef = useRef(carState);
  const animationFrameId = useRef<number>(0);
  const hornAudioRef = useRef<HTMLAudioElement>(null);

  const { sendData } = useDataMessage({
    onMessage(payload, from, label) {
      if (label === "car-update" && !isHost) {
        setCarState(JSON.parse(payload));
      } else if (label === "horn" && hornAudioRef.current) {
        hornAudioRef.current.play();
      }
    },
  });

  useEffect(() => {
    if (isHost) {
      setHostPeerId(localPeerId);
    } else {
      setHostPeerId(hostPeerIds[0] || null);
    }
  }, [hostPeerIds, isHost, localPeerId]);

  useEffect(() => {
    getAccessToken({ roomId, isHost }).then((token) =>
      joinRoom({ roomId, token })
    );
    return () => {
      leaveRoom();
    };
  }, [roomId, isHost]);

  useEffect(() => {
    if (!isHost) return;
    const down = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keysPressed.current)
        keysPressed.current[key as keyof typeof keysPressed.current] = true;
      if (e.repeat) return;
      if (key === "l")
        carStateRef.current.areLightsOn = !carStateRef.current.areLightsOn;
      if (key === "r") {
        carStateRef.current.x = 50;
        carStateRef.current.y = 50;
        carStateRef.current.angle = 0;
      }
      if (key === "h" && hornAudioRef.current && !isHornOnCooldown) {
        setIsHornOnCooldown(true);
        hornAudioRef.current.play();
        sendData({ to: "*", payload: "play", label: "horn" });
        setTimeout(() => setIsHornOnCooldown(false), 3000);
      }
    };
    const up = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keysPressed.current)
        keysPressed.current[key as keyof typeof keysPressed.current] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    const gameLoop = () => {
      if (!viewportRef.current) {
        animationFrameId.current = requestAnimationFrame(gameLoop);
        return;
      }
      const CAR_RADIUS_PX = 64.5;
      const viewportWidth = viewportRef.current.clientWidth;
      const viewportHeight = viewportRef.current.clientHeight;
      const marginX = (CAR_RADIUS_PX / viewportWidth) * 100;
      const marginY = (CAR_RADIUS_PX / viewportHeight) * 100;

      let { x, y, angle } = carStateRef.current;
      const areLightsOn = carStateRef.current.areLightsOn;
      const baseSpeed = 0.8,
        nitroSpeed = 1.5,
        turnSpeed = 3.5;
      const speed = keysPressed.current.shift ? nitroSpeed : baseSpeed;

      if (keysPressed.current.a) angle -= turnSpeed;
      if (keysPressed.current.d) angle += turnSpeed;
      if (keysPressed.current.w) {
        x += Math.sin((Math.PI / 180) * angle) * speed;
        y -= Math.cos((Math.PI / 180) * angle) * speed;
      }
      if (keysPressed.current.s) {
        x -= Math.sin((Math.PI / 180) * angle) * speed * 0.7;
        y += Math.cos((Math.PI / 180) * angle) * speed * 0.7;
      }

      const clampedX = Math.max(marginX, Math.min(100 - marginX, x));
      const clampedY = Math.max(marginY, Math.min(100 - marginY, y));

      const newState: CarState = {
        x: clampedX,
        y: clampedY,
        angle,
        keys: { ...keysPressed.current },
        areLightsOn,
      };
      carStateRef.current = newState;
      setCarState(newState);
      sendData({
        to: "*",
        payload: JSON.stringify(newState),
        label: "car-update",
      });
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };
    animationFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [isHost, sendData, isHornOnCooldown]);

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("host");
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyRoomId = () => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId);
    setIsRoomIdCopied(true);
    setTimeout(() => setIsRoomIdCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <main
        ref={viewportRef}
        className="relative h-screen w-screen overflow-hidden bg-zinc-900 text-zinc-200"
      >
        <Image
          fill
          priority
          quality={100}
          src="/images/bg.png"
          alt="Playground background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <audio
          ref={hornAudioRef}
          src="/sounds/car-horn.mp3"
          preload="auto"
        ></audio>
        <div className="absolute inset-0 bg-grid-zinc-700/[0.2]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent" />

        {state === "connected" ? (
          <Car
            x={carState.x}
            y={carState.y}
            angle={carState.angle}
            keys={carState.keys}
            areLightsOn={carState.areLightsOn}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-400">
            {state === "idle" ? "Connecting..." : `Status: ${state}`}
          </div>
        )}

        <div className="absolute left-6 top-6 md:left-8 md:top-8">
          <h1 className="text-xl font-bold tracking-wider">Sync Rover</h1>
          <div className="flex items-center gap-2">
            <p className="font-mono text-xs text-zinc-400">Room: {roomId}</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleCopyRoomId}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  {isRoomIdCopied ? (
                    <Check size={14} className="text-green-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy Room ID</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="absolute right-6 top-6 h-36 w-64 md:right-8 md:top-8 md:h-40 md:w-72">
          <HostVideoStream hostPeerId={hostPeerId} isHost={isHost} />
        </div>

        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
          <Controls keys={carState.keys} isHornOnCooldown={isHornOnCooldown} />
        </div>

        <div className="absolute bottom-6 right-6 flex items-center gap-3 md:bottom-8 md:right-8">
          <div className="flex items-center gap-2 rounded-md bg-zinc-800/80 px-3 py-1.5 text-sm backdrop-blur-sm">
            <Users size={16} />
            <span>{peerIds.length + 1}</span>
          </div>
          <div
            className={`rounded-md px-3 py-1.5 text-sm font-semibold backdrop-blur-sm ${
              isHost ? "bg-zinc-100 text-zinc-900" : "bg-zinc-800/80"
            }`}
          >
            {isHost ? "HOST" : "VIEWER"}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="secondary" onClick={handleShare}>
                {copied ? <Check size={20} /> : <Share2 size={20} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? "Link Copied!" : "Share Invite Link"}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => {
                  leaveRoom();
                  router.push("/");
                }}
              >
                <LogOut size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Leave Room</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </main>
    </TooltipProvider>
  );
};

export default Room;
