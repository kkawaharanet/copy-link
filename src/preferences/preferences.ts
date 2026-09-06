import type { LinkType } from "@/link/link-type";

export interface Preferences {
  linkType: LinkType;
  queryParameters: boolean;
}

export const DEFAULT_PREFERENCES: Preferences = {
  linkType: "plaintext",
  queryParameters: true,
};
