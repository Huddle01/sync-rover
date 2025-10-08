"use client";

import { HuddleProvider, HuddleClient } from "@huddle01/react";
import { ReactNode } from "react";

const huddleClient = new HuddleClient({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  options: {
    autoConsume: true,
  },
});

export const Huddle01Provider = ({ children }: { children: ReactNode }) => {
  return <HuddleProvider client={huddleClient}>{children}</HuddleProvider>;
};
