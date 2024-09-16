"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ReactNode } from "react";

interface SessionProviderProps {
  children: ReactNode;
  session: Session | null;
}
const SessionProviderClient = ({ children, session }: SessionProviderProps) => {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
};

export default SessionProviderClient;