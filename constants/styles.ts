// Color palette
export const colors = {
  primary: {
    main: '#38F2B8',
    dark: '#157356',
    light: '#E9E8E8',
  },
  text: {
    primary: '#716666',
    secondary: '#666666',
    muted: '#687076',
  },
  background: {
    main: '#FFFFFF',
    light: '#F8F8F8',
    accent: '#EAE8E8',
  },
  shadow: {
    light: 'rgba(13, 39, 80, 0.25)',
    dark: 'rgba(0, 0, 0, 0.1)',
  },
  border: {
    light: '#e9ecef',
    main: '#ccc',
  },
  status: {
    error: '#E76F51',
    success: '#38F2B8',
  }
} as const;

// Spacing scale
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
} as const;

// Typography
export const typography = {
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.25rem',    // 20px
    xl: '1.5rem',     // 24px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
  },
} as const;

// Shadows
export const shadows = {
  sm: `0 1px 2px ${colors.shadow.dark}`,
  md: `0 4px 6px ${colors.shadow.dark}`,
  lg: `12px 12px 32px ${colors.shadow.light}`,
} as const;

// Border radius
export const borderRadius = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
} as const; 