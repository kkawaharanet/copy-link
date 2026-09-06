import { storage } from "@wxt-dev/storage";
import { use } from "react";
import { DEFAULT_PREFERENCES, type Preferences } from "./preferences";

const preferencesItem = storage.defineItem<Preferences>("local:preferences", {
  fallback: DEFAULT_PREFERENCES,
});

const initialPreferencesPromise = preferencesItem.getValue();

export interface IPreferencesService {
  preferences: Preferences;
  setPreferences(preferences: Preferences): Promise<void>;
}

export function usePreferencesService(): IPreferencesService {
  const initial = use(initialPreferencesPromise);
  const [preferences, setPreferencesState] = useState(initial);

  async function setPreferences(value: Preferences) {
    await preferencesItem.setValue(value);
    setPreferencesState(value);
  }

  return { preferences, setPreferences };
}
