// lib/loadTranslations.ts
export const loadTranslations = async (locale: string) => {
  const messages = await import(`../messages/${locale}.json`);
  return (key: string, variables?: Record<string, string>) => {
    let translation = messages[key] || key;
    if (variables) {
      Object.keys(variables).forEach((variable) => {
        translation = translation.replace(`{${variable}}`, variables[variable]);
      });
    }
    return translation;
  };
};
