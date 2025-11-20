import React, { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { useTheme } from '@shared';

interface ThemeWrapperProps {
  children: ReactNode;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  const { theme } = useTheme();

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
