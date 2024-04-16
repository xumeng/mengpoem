import "server-only";

export const defaultLocale = "zh-Hans";
export const locales = ["zh-Hans", "zh-Hant", "en", "ja", "ko"] as const;
const dictionaries = {
  "zh-Hant": () => import("./zh-Hant.json").then((module) => module.default),
  "zh-Hans": () => import("./zh-Hans.json").then((module) => module.default),
  en: () => import("./en.json").then((module) => module.default),
  ja: () => import("./ja.json").then((module) => module.default),
  ko: () => import("./ko.json").then((module) => module.default),
};

export type Locale = (typeof locales)[number];

/**
 * 生成多语言 meta hreflang 标签
 */
export const getMetaDataAlternates = (suffix: string, lang: Locale) => {
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    languages[locale] = `/${locale}${suffix}`;
  }

  return {
    languages,
    canonical: `/${lang}${suffix}`,
  };
};

const defaultsConfig = (
  de: Record<string, string | object>,
  target: Record<string, string | object | undefined>,
) => {
  for (const key in de) {
    if (target[key] === undefined) {
      target[key] = de[key];
    } else if (typeof de[key] === "object") {
      defaultsConfig(
        de[key] as Record<string, string | object>,
        target[key] as Record<string, string | object>,
      );
    }
  }

  return target;
};

export const getDictionary = async (locale: Locale = "zh-Hans") => {
  const zhHans = await dictionaries["zh-Hans"]();
  // console.log(">>>>>1111", locale);
  // if (!locales.includes(locale)) {
  //   locale = defaultLocale;
  // }
  // console.log(">>>>>111122222", locale);
  const targetLocale = await dictionaries[locale]();

  return defaultsConfig(zhHans, targetLocale) as typeof zhHans;
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export const getLangText = (obj: Record<string, string>, lang: Locale) =>
  obj[lang] || obj[defaultLocale] || "";

export const getLangUrl = (url: string, lang: Locale) => `/${lang}${url}`;
