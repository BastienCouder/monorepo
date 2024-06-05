'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { IntlProvider, useLocale } from 'next-intl';

interface ClientIntlProviderProps {
    children: ReactNode;
}

const ClientIntlProvider: React.FC<ClientIntlProviderProps> = ({ children }) => {
    const locale = useLocale()
    const [messages, setMessages] = useState<any | null>(null);

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const loadedMessages = await import(`../../locales/${locale}.json`);
                setMessages(loadedMessages.default);
            } catch (error) {
                console.error('Failed to load messages:', error);
            }
        };
        loadMessages();
    }, [locale]);

    if (!messages) {
        return;
    }

    return (
        <IntlProvider messages={messages} locale={locale}>
            {children}
        </IntlProvider>
    );
};

export default ClientIntlProvider;
