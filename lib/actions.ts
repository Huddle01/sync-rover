"use server";

import { AccessToken, Role } from "@huddle01/server-sdk/auth";

export const createRoomId = async (): Promise<string> => {
  const response = await fetch(
    "https://api.huddle01.com/api/v2/sdk/rooms/create-room",
    {
      method: "POST",
      body: JSON.stringify({
        title: "Huddle01 Room",
      }),
      headers: {
        "Content-type": "application/json",
        "x-api-key": process.env.API_KEY!,
      },
      cache: "no-cache",
    }
  );

  const data = await response.json();
  const roomId = data.data.roomId;
  return roomId;
};

export const getAccessToken = async (
  roomId: string,
  isGuest?: boolean
): Promise<string> => {
  const accessToken = new AccessToken({
    apiKey: process.env.API_KEY!,
    roomId: roomId as string,
    role: isGuest ? Role.GUEST : Role.HOST,
    permissions: {
      admin: true,
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: true,
        mic: true,
        screen: true,
      },
      canRecvData: true,
      canSendData: true,
      canUpdateMetadata: true,
    },
  });

  const token = await accessToken.toJwt();

  return token;
};
