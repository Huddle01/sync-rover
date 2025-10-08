"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createRoomId } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Github, Bot, PlusCircle, LogIn } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  const handleCreateRoom = async () => {
    try {
      const newRoomId = await createRoomId();
      router.push(`/room/${newRoomId}?host=true`);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  const handleJoinRoom = () => {
    if (!roomId) return;
    router.push(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-zinc-950 text-zinc-200">
      <main className="flex flex-col items-center justify-center p-8 border-r border-zinc-800/50">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center text-center">
            <Bot className="w-12 h-12 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight mt-4">
              Sync Rover
            </h1>
            <p className="mt-2 text-zinc-400">
              Create or join a real-time control session.
            </p>
          </div>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                <span>Create a New Room</span>
              </CardTitle>
              <CardDescription>
                Start a new session as the host to control the rover.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                onClick={handleCreateRoom}
                className="w-full font-semibold"
              >
                Create Room
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                <span>Join an Existing Room</span>
              </CardTitle>
              <CardDescription>
                Enter a room ID to join a session as a viewer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex w-full items-center space-x-2">
                <Input
                  className="bg-zinc-800 border-zinc-700 placeholder:text-zinc-500"
                  placeholder="Enter Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
                />
                <Button
                  variant={"secondary"}
                  onClick={handleJoinRoom}
                  disabled={!roomId}
                >
                  Join
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <a
          href="https://huddle01.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-8 flex items-center space-x-2 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <Github className="w-5 h-5" />
          <span>Built with Huddle01 SDK</span>
        </a>
      </main>

      <aside className="hidden lg:flex flex-col items-center justify-center relative bg-zinc-950 overflow-hidden">
        <video
          src="/videos/puik.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
      </aside>
    </div>
  );
}
