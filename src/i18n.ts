import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from './config';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) {
    notFound();
  }
  try {
    const appMessages = await import(`../locales/${locale}.json`).then(
      (m) => m.default
    );
    // console.log(appMessages);

    return {
      messages: {
        ...appMessages,
      },
    };
  } catch (error) {
    console.error('Error in loading messages:', error);
    return { messages: {} };
  }
});
