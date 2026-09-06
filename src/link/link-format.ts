import type { Link } from "./link";
import type { LinkType } from "./link-type";

export function toQueryParametersRemovedUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.origin == "null") {
      return url;
    }
    return u.origin + u.pathname;
  } catch {
    // 文字列がURLではない
    return url;
  }
}

export function linkToString(
  link: Link,
  type: LinkType,
  includeQueryParameters: boolean
): string {
  const url = includeQueryParameters
    ? link.url
    : toQueryParametersRemovedUrl(link.url);
  switch (type) {
    case "csv":
      return `${url},${link.title}`;
    case "tsv":
      return `${url}\t${link.title}`;
    case "html":
      return `<a href="${url}">${link.title}</a>`;
    case "markdown":
      return `[${link.title}](${url})`;
    case "textile":
      return `"${link.title}":${url}`;
    default:
      return `${link.title}\n${url}`;
  }
}
