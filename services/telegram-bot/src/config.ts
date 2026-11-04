export class ConfigError extends Error {
  constructor() {
    super("TELEGRAM_BOT_TOKEN is required.");
    this.name = "ConfigError";
  }
}

export interface BotConfig {
  telegramBotToken: string;
  superAdminIds: number[];
}

export function loadConfig(): BotConfig {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN?.trim();

  if (!telegramBotToken) {
    throw new ConfigError();
  }

  return { 
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? "",
    superAdminIds: (process.env.SUPER_ADMIN_IDS ??"")
     .split(",")
     .map((id) => Number(id.trim()))
     .filter((id) => Number.isSafeInteger(id) && id >0),
   };
}
