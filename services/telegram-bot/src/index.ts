import { createBot } from "./bot.js";
import { ConfigError, loadConfig } from "./config.js";

async function main(): Promise<void> {
  const config = loadConfig();
  const bot = createBot(config.telegramBotToken);
  let stopping = false;

  const shutdown = (): void => {
    if (stopping) {
      return;
    }

    stopping = true;
    process.stdout.write("[telegram-bot] Stopping Long Polling.\n");
    bot.stop();
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);

  await bot.start({
    onStart: () => {
      process.stdout.write("[telegram-bot] Long Polling started for @fili3_bot.\n");
    },
  });
}

main().catch((error: unknown) => {
  if (error instanceof ConfigError) {
    process.stderr.write(`[telegram-bot] ${error.message}\n`);
  } else {
    process.stderr.write(
      "[telegram-bot] Startup failed; details omitted for security.\n",
    );
  }

  process.exitCode = 1;
});
