import React, { createContext } from "react";
import { type ILinkService, useLinkService } from "./link-service";

const defaultLinkService: ILinkService = {
  link: { title: "", url: "" },
};

export const LinkServiceContext = createContext(defaultLinkService);

export function LinkServiceProvider({ children }: { children: React.ReactNode }) {
  const linkService = useLinkService();

  return (
    <LinkServiceContext value={linkService}>
      {children}
    </LinkServiceContext>
  );
}
