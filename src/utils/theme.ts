export const theme = {
  colors: {
    primary: '#FF6B6B', // Vibrant Red/Pink
    secondary: '#4ECDC4', // Bright Teal
    background: '#F7FFF7', // Off-white/Mint
    surface: '#FFFFFF',
    text: '#2C3E50', // Dark Blue/Gray for readability
    textLight: '#95A5A6',
    success: '#A8E6CF',
    error: '#FF8B94',
    border: '#E8F0F2',
  },
  typography: {
    fontFamily: 'System', 
    h1: {
      fontSize: 32,
      fontWeight: 'bold' as const,
      color: '#2C3E50',
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      color: '#2C3E50',
    },
    body: {
      fontSize: 18, 
      color: '#2C3E50',
    },
    button: {
      fontSize: 20,
      fontWeight: 'bold' as const,
      color: '#FFFFFF',
    }
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  borderRadius: {
    m: 12,
    l: 20,
    round: 9999,
  }
};
