import type { Link } from "@/link/link";
import { linkToString } from "@/link/link-format";
import { LINK_TYPES, type LinkType } from "@/link/link-type";
import {
  DEFAULT_PREFERENCES,
  type Preferences,
} from "@/preferences/preferences";

async function copyToClipboard(tabId: number, text: string) {
  await browser.scripting.executeScript({
    target: { tabId },
    func: (t) => navigator.clipboard.writeText(t),
    args: [text],
  });
}

export default defineBackground(() => {
  const copyLinkParent = "copyLinkParent";

  browser.contextMenus.create({
    id: copyLinkParent,
    title: browser.i18n.getMessage("applicationName"),
    contexts: ["link"],
  });

  type I18nMessageKey = Parameters<typeof browser.i18n.getMessage>[0];
  const contextMenuTitleKeys: Record<LinkType, I18nMessageKey> = {
    plaintext: "copyAsPlaintext",
    csv: "copyAsCsv",
    tsv: "copyAsTsv",
    html: "copyAsHtml",
    markdown: "copyAsMarkdown",
    textile: "copyAsTextile",
  };

  for (const linkType of LINK_TYPES) {
    browser.contextMenus.create({
      id: linkType,
      parentId: copyLinkParent,
      title: browser.i18n.getMessage(contextMenuTitleKeys[linkType]),
      contexts: ["link"],
    });
  }

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    // コンテキストメニューがタブ以外から発火したとき
    // PDFビューアなど特殊なページから発火したとき、何もしない
    if (!tab?.id) {
      return;
    }

    // 設定を取得する
    const result = await browser.storage.local.get("preferences");
    const preferences: Preferences =
      (result.preferences as Preferences) ?? DEFAULT_PREFERENCES;

    // ユーザーが選択したリンク形式を取得する
    const linkType = LINK_TYPES.find((t) => t === info.menuItemId);
    if (!linkType) {
      return;
    }

    // 右クリック時のリンクURLを取得する
    const linkUrl = info.linkUrl ?? "";

    // リンクテキストはinfoから取得できないのでスクリプトを実行して取得する
    const results = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: (url) => {
        const anchors = Array.from(
          document.querySelectorAll("a[href]"),
        ) as HTMLAnchorElement[];
        const anchor = anchors.find((a) => a.href === url);
        return anchor ? anchor.innerText.replaceAll("\n", "").trim() : ""; // 前後の空白と改行を取り除く
      },
      args: [linkUrl],
    });
    const linkText = results[0]?.result ?? "";

    // リンクをクリップボードへコピーする
    const link: Link = { url: linkUrl, title: linkText };
    copyToClipboard(
      tab.id,
      linkToString(link, linkType, preferences.queryParameters),
    );
  });
});
