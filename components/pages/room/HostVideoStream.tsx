"use client";

import {
  useLocalVideo,
  useRemoteVideo,
  useLocalAudio,
  useRemoteAudio,
  useDevices,
} from "@huddle01/react/hooks";
import { Video, Audio } from "@huddle01/react/components";
import { Mic, MicOff, VideoIcon, VideoOff, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface HostVideoStreamProps {
  hostPeerId: string | null;
  isHost: boolean;
}

const HostView = () => {
  const { stream, isVideoOn, enableVideo, disableVideo, changeVideoSource } =
    useLocalVideo();
  const { isAudioOn, enableAudio, disableAudio, changeAudioSource } =
    useLocalAudio();
  const { devices: camDevices } = useDevices({ type: "cam" });
  const { devices: micDevices } = useDevices({ type: "mic" });

  return (
    <div className="group relative h-full w-full overflow-hidden rounded-lg border-2 border-zinc-700 bg-zinc-900/80 shadow-lg backdrop-blur-sm aspect-video">
      <div className="flex h-full w-full items-center justify-center">
        {stream && isVideoOn ? (
          <Video stream={stream} className="h-full w-full object-cover" />
        ) : (
          <User className="h-12 w-12 text-zinc-500" />
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Button
          size="icon"
          variant={isVideoOn ? "secondary" : "destructive"}
          onClick={() => (isVideoOn ? disableVideo() : enableVideo())}
        >
          {isVideoOn ? <VideoIcon size={20} /> : <VideoOff size={20} />}
        </Button>
        <Button
          size="icon"
          variant={isAudioOn ? "secondary" : "destructive"}
          onClick={() => (isAudioOn ? disableAudio() : enableAudio())}
        >
          {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="secondary">
              <Settings size={20} />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[80vw] max-w-xs border-zinc-700 bg-zinc-900 text-zinc-200"
            sideOffset={8}
          >
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Device Settings</h4>
                <p className="text-sm text-zinc-400">
                  Manage your camera and microphone.
                </p>
              </div>
              <div className="grid gap-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Label
                    htmlFor="camera-select"
                    className="flex-shrink-0 sm:w-16 sm:text-right"
                  >
                    Camera
                  </Label>
                  <Select
                    onValueChange={changeVideoSource}
                    disabled={!isVideoOn}
                  >
                    <SelectTrigger
                      id="camera-select"
                      className="w-full truncate"
                    >
                      <SelectValue placeholder="Select camera" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 overflow-y-auto">
                      {camDevices.map((device) => (
                        <SelectItem
                          key={device.deviceId}
                          value={device.deviceId}
                        >
                          <span className="truncate">{device.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Label
                    htmlFor="mic-select"
                    className="flex-shrink-0 sm:w-16 sm:text-right"
                  >
                    Mic
                  </Label>
                  <Select
                    onValueChange={changeAudioSource}
                    disabled={!isAudioOn}
                  >
                    <SelectTrigger id="mic-select" className="w-full truncate">
                      <SelectValue placeholder="Select microphone" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 overflow-y-auto">
                      {micDevices.map((device) => (
                        <SelectItem
                          key={device.deviceId}
                          value={device.deviceId}
                        >
                          <span className="truncate">{device.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

const ViewerView = ({ hostPeerId }: { hostPeerId: string }) => {
  const { stream: videoStream, isVideoOn } = useRemoteVideo({
    peerId: hostPeerId,
  });
  const { stream: audioStream } = useRemoteAudio({ peerId: hostPeerId });

  if (!isVideoOn || !videoStream) return null;

  return (
    <>
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border-2 border-zinc-700 bg-zinc-900/80 shadow-lg backdrop-blur-sm aspect-video">
        <Video stream={videoStream} className="h-full w-full object-cover" />
      </div>
      {audioStream && <Audio stream={audioStream} />}
    </>
  );
};

export const HostVideoStream = ({
  hostPeerId,
  isHost,
}: HostVideoStreamProps) => {
  if (!hostPeerId && !isHost) {
    return null;
  }

  if (isHost) {
    return <HostView />;
  }

  return <ViewerView hostPeerId={hostPeerId!} />;
};
