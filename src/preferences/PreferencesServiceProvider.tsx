import React, { createContext } from "react";
import { DEFAULT_PREFERENCES } from "./preferences";
import { type IPreferencesService, usePreferencesService } from "./preferences-service";

const defaultPreferencesService: IPreferencesService = {
  preferences: DEFAULT_PREFERENCES,
  setPreferences: () => {
    throw new Error("Function not implemented.");
  },
};

export const PreferencesServiceContext = createContext(defaultPreferencesService);

export function PreferencesServiceProvider({ children }: { children: React.ReactNode }) {
  const preferencesService = usePreferencesService();

  return (
    <PreferencesServiceContext value={preferencesService}>
      {children}
    </PreferencesServiceContext>
  );
}
