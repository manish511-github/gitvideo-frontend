"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Allow theme switching instead of forcing dark theme
  const themeProps = {
    ...props,
    defaultTheme: "dark",
    enableSystem: false,
  }

  return <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
}

