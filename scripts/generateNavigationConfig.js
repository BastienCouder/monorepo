const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'locales');
const outputFilePath = path.join(__dirname, '..', 'src', 'config.ts');

const locales = ['en', 'fr'];

async function generateNavigationConfig() {
  let pathnames = { '/': '/' };

  for (const locale of locales) {
    const localeFilePath = path.join(localesDir, `${locale}.json`);
    const localeData = JSON.parse(fs.readFileSync(localeFilePath, 'utf-8'));

    Object.keys(localeData.navigation).forEach((key) => {
      const route = localeData.navigation[key];
      if (route && typeof route === 'object' && route.href) {
        if (!pathnames[`/${key}`]) {
          pathnames[`/${key}`] = {};
        }
        pathnames[`/${key}`][locale] = route.href;
      }
    });
  }

  const content = `import { Pathnames } from 'next-intl/navigation';

export const locales = ${JSON.stringify(locales)} as const;

export const pathnames: Pathnames<typeof locales> = ${JSON.stringify(pathnames, null, 2)};

export const localePrefix = "always";

export type AppPathnames = keyof typeof pathnames;
`;

  fs.writeFileSync(outputFilePath, content);
  console.log(`Navigation config generated successfully at: ${outputFilePath}`);
}

generateNavigationConfig();
