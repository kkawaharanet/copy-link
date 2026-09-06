import { use } from "react";
import type { Link } from "./link";
import { getLink } from "./link-functions";

const linkPromise = getLink();

export interface ILinkService {
  link: Link;
}

export function useLinkService(): ILinkService {
  const link = use(linkPromise);
  return { link };
}
