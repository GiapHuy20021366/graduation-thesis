import React, { createContext, useEffect, useState } from "react";
import {
  Language,
  LanguageCode,
  LanguageComponent,
  getLanguage,
} from "../store";

interface II18nContextProviderProps {
  children: React.ReactNode;
}

export type I18Resolver = (key: string, ...params: any[]) => string;

interface II18nContext {
  language: Language;
  switchLanguage(code: LanguageCode): void;
  of(component: React.ComponentType<any>): I18Resolver;
}

export const I18nContext = createContext<II18nContext>({
  language: {
    code: "vi",
    value: {},
  },
  switchLanguage: (): void => {},
  of: () => () => "",
});

const i18nKey = "i18n.code";

export default function I18nContextProvider({
  children,
}: II18nContextProviderProps) {
  const [language, setLanguage] = useState<Language>({
    code: "vi",
    value: {},
  });

  const switchLanguage = (code: LanguageCode | null): void => {
    getLanguage(code)
      .then((value: Language) => {
        setLanguage(value);
        localStorage.setItem(i18nKey, value.code);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const of = (component: React.ComponentType<any>): I18Resolver => {
    const componentName = component.name;
    const componentLanguage = language.value[componentName] as
      | LanguageComponent
      | undefined;
    return (key: string, ...params: any[]): string => {
      if (componentLanguage == null) {
        return `!<${componentName}>.[${key}]`;
        // return key;
      }
      const template = componentLanguage[key] as string | undefined;
      if (template == null) {
        return `<${componentName}>.![${key}]`;
        // return key;
      }

      return template.replace(/\{.*?\}/g, (match: string): string => {
        const num = match.slice(1, -1).trim();
        const index = +num;
        const replace = params[index];
        return replace != null ? replace : match;
      });
    };
  };

  useEffect(() => {
    const code = localStorage.getItem(i18nKey) as LanguageCode | null;
    switchLanguage(code);
  }, []);

  return (
    <I18nContext.Provider
      value={{
        language,
        switchLanguage,
        of,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}
