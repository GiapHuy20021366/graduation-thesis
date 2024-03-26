import { useI18nContext } from "./useI18nContext";
import { I18nReactComponent } from "../store/i18n/components";

export const useComponentLanguage = (
  ...components: (I18nReactComponent | React.ComponentType<any>)[]
) => {
  const i18nContext = useI18nContext();
  return i18nContext.of(...components);
};
