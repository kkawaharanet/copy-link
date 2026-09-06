import { linkToString } from "@/link/link-format";
import { LINK_TYPES } from "@/link/link-type";
import { LinkServiceContext } from "@/link/LinkServiceProvider";
import { PreferencesServiceContext } from "@/preferences/PreferencesServiceProvider";
import { type ChangeEvent, use } from "react";
import styles from "./App.module.css";

function handleFocus(
  event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>,
) {
  event.target.select();
}

export function LinkTab() {
  const linkService = use(LinkServiceContext);
  const preferencesService = use(PreferencesServiceContext);

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
  }

  function handleChangeQueryParameters(event: ChangeEvent<HTMLInputElement>) {
    preferencesService.setPreferences({
      ...preferencesService.preferences,
      queryParameters: event.target.checked,
    });
  }

  return (
    <>
      <div className={styles.linkList}>
        {LINK_TYPES.map((type) => {
          const text = linkToString(
            linkService.link,
            type,
            preferencesService.preferences.queryParameters,
          );
          return (
            <div key={type} className={styles.linkRow}>
              <span className={styles.linkLabel}>
                {browser.i18n.getMessage(type)}
              </span>
              <div className={styles.linkRowControls}>
                {type === "plaintext" ? (
                  <textarea
                    value={text}
                    className={styles.linkTextarea}
                    rows={2}
                    readOnly
                    onFocus={handleFocus}
                  />
                ) : (
                  <input
                    type="text"
                    value={text}
                    className={styles.linkTextarea}
                    readOnly
                    onFocus={handleFocus}
                  />
                )}
                <button onClick={() => handleCopy(text)}>
                  {browser.i18n.getMessage("copy")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <dl className={styles.preferencesContainer}>
        <dt>{browser.i18n.getMessage("queryParameters")}</dt>
        <dd>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="checkboxQueryParametersLink"
              checked={preferencesService.preferences.queryParameters}
              onChange={handleChangeQueryParameters}
            />
            <label htmlFor="checkboxQueryParametersLink">
              {browser.i18n.getMessage("enable")}
            </label>
          </div>
        </dd>
      </dl>
    </>
  );
}
