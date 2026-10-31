"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

function ThemeSync() {
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    if (resolvedTheme) {
      document.documentElement.setAttribute("data-theme", resolvedTheme);
    }
  }, [resolvedTheme]);

  return null;
}

export default function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider {...props}>
      <ThemeSync />
      {children}
    </NextThemesProvider>
  );
}
