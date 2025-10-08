import Room from "@/components/pages/room";
import React from "react";

const RoomIdPage = async ({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) => {
  const { roomId } = await params;

  return <Room roomId={roomId} />;
};

export default RoomIdPage;
