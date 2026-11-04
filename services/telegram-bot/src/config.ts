export class ConfigError extends Error {
  constructor() {
    super("TELEGRAM_BOT_TOKEN is required.");
    this.name = "ConfigError";
  }
}

export interface BotConfig {
  telegramBotToken: string;
}

export function loadConfig(): BotConfig {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN?.trim();

  if (!telegramBotToken) {
    throw new ConfigError();
  }

  return { telegramBotToken };
}
