import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  manifest: {
    name: "__MSG_applicationName__",
    version: "3.5.3",
    description: "__MSG_description__",
    default_locale: "en",
    permissions: [
      "activeTab", // backgroundでのscripting.executeScript()に必要
      "contextMenus", // 右クリックメニューに必要
      "scripting", // scripting.executeScript()を使ったリンクテキスト取得に必要
      "storage", // 設定の保存に必要
    ],
    action: {
      default_title: "__MSG_applicationName__",
      default_popup: "index.html",
      default_icon: {
        "16": "icon/16.png",
        "48": "icon/48.png",
        "128": "icon/128.png",
      },
    },
  },
});
