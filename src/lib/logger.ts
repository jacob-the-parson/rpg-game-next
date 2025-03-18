/**
 * Enhanced logger utility for application-wide logging
 */
const Logger = {
  /**
   * Log an informational message with optional data
   */
  info: (message: string, data?: any) => {
    console.log(`ℹ️ ${message}`, data !== undefined ? data : '');
  },

  /**
   * Log a success message with optional data
   */
  success: (message: string, data?: any) => {
    console.log(`✅ ${message}`, data !== undefined ? data : '');
  },

  /**
   * Log a warning message with optional data
   */
  warn: (message: string, data?: any) => {
    console.warn(`⚠️ ${message}`, data !== undefined ? data : '');
  },

  /**
   * Log an error message with optional data
   */
  error: (message: string, error?: any) => {
    console.error(`🚨 ${message}`, error !== undefined ? error : '');
    
    // If in development, also log the stack trace
    if (process.env.NODE_ENV === 'development' && error?.stack) {
      console.error(`Stack trace:`, error.stack);
    }
  },

  /**
   * Log a game-specific message
   */
  game: (message: string, data?: any) => {
    console.log(`🎮 ${message}`, data !== undefined ? data : '');
  },

  /**
   * Log network activity
   */
  network: (message: string, data?: any) => {
    console.log(`🌐 ${message}`, data !== undefined ? data : '');
  },

  /**
   * Log performance metrics
   */
  performance: (message: string, data?: any) => {
    console.log(`⚡ ${message}`, data !== undefined ? data : '');
  },

  /**
   * Creates a scoped logger with a prefix
   */
  createScopedLogger: (scope: string) => {
    return {
      info: (message: string, data?: any) => Logger.info(`[${scope}] ${message}`, data),
      success: (message: string, data?: any) => Logger.success(`[${scope}] ${message}`, data),
      warn: (message: string, data?: any) => Logger.warn(`[${scope}] ${message}`, data),
      error: (message: string, error?: any) => Logger.error(`[${scope}] ${message}`, error),
      game: (message: string, data?: any) => Logger.game(`[${scope}] ${message}`, data),
      network: (message: string, data?: any) => Logger.network(`[${scope}] ${message}`, data),
      performance: (message: string, data?: any) => Logger.performance(`[${scope}] ${message}`, data),
    };
  }
};

export default Logger; 