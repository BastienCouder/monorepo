"use client"
import React, { createContext, useContext, useState, useEffect } from 'react'
import { Theme } from '@/registry/themes'

type Config = {
    theme: Theme["name"]
}

const defaultConfig: Config = {
    theme: 'zinc',
}

const ConfigContext = createContext<{
    config: Config
    setConfig: React.Dispatch<React.SetStateAction<Config>>
}>({
    config: defaultConfig,
    setConfig: () => { },
})

export const useConfig = () => {
    return useContext(ConfigContext)
}

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const [config, setConfig] = useState<Config>(() => {
        // Load initial state from localStorage if available
        const savedConfig = localStorage.getItem('config')
        return savedConfig ? JSON.parse(savedConfig) : defaultConfig
    })

    useEffect(() => {
        // Save config to localStorage whenever it changes
        localStorage.setItem('config', JSON.stringify(config))
    }, [config])

    return (
        <ConfigContext.Provider value={{ config, setConfig }}>
            {children}
        </ConfigContext.Provider>
    )
}
