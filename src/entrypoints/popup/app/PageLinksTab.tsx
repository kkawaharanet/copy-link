import type { Link } from "@/link/link";
import { linkToString } from "@/link/link-format";
import { getLinksInTab } from "@/link/link-functions";
import { LINK_TYPES, type LinkType } from "@/link/link-type";
import { PreferencesServiceContext } from "@/preferences/PreferencesServiceProvider";
import { type ChangeEvent, use } from "react";
import styles from "./App.module.css";

function handleFocus(event: React.FocusEvent<HTMLTextAreaElement>) {
  event.target.select();
}

export function PageLinksTab() {
  const preferencesService = use(PreferencesServiceContext);
  const [links, setLinks] = useState<Link[] | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getLinksInTab().then(setLinks);
  }, []);

  useEffect(() => {
    setCopied(false);
  }, [preferencesService.preferences]);

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
    });
  }

  function handleChangeLinkType(event: ChangeEvent<HTMLSelectElement>) {
    preferencesService.setPreferences({
      ...preferencesService.preferences,
      linkType: event.target.value as LinkType,
    });
  }

  function handleChangeQueryParameters(event: ChangeEvent<HTMLInputElement>) {
    preferencesService.setPreferences({
      ...preferencesService.preferences,
      queryParameters: event.target.checked,
    });
  }

  if (links === null) {
    return (
      <>
        <p>{browser.i18n.getMessage("nothingHere")}</p>
      </>
    );
  }

  const value = links
    .map((l) =>
      linkToString(
        l,
        preferencesService.preferences.linkType,
        preferencesService.preferences.queryParameters,
      ),
    )
    .join("\n");

  return (
    <>
      <textarea
        value={value}
        onFocus={handleFocus}
        className={styles.linkTextarea}
        rows={8}
        wrap="off"
        readOnly
      />
      <button onClick={() => handleCopy(value)}>
        {browser.i18n.getMessage(copied ? "copied" : "copy")}
      </button>
      <dl className={styles.preferencesContainer}>
        <dt>{browser.i18n.getMessage("format")}</dt>
        <dd>
          <select
            value={preferencesService.preferences.linkType}
            onChange={handleChangeLinkType}
          >
            {LINK_TYPES.map((linkType) => (
              <option value={linkType} key={linkType}>
                {browser.i18n.getMessage(linkType)}
              </option>
            ))}
          </select>
        </dd>
        <dt>{browser.i18n.getMessage("queryParameters")}</dt>
        <dd>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="checkboxQueryParametersLinksInPage"
              checked={preferencesService.preferences.queryParameters}
              onChange={handleChangeQueryParameters}
            />
            <label htmlFor="checkboxQueryParametersLinksInPage">
              {browser.i18n.getMessage("enable")}
            </label>
          </div>
        </dd>
      </dl>
    </>
  );
}
