import { Bot } from "grammy";

const START_MESSAGE = "Система Персонал и контроль подключена";
const UNKNOWN_COMMAND_MESSAGE = "Неизвестная команда. Используйте /start.";

export function createBot(token: string): Bot {
  const bot = new Bot(token);

  bot.command("start", async (ctx) => {
    const telegramId = ctx.from?.id;
    if (!telegramId) return;
    await ctx.reply(START_MESSAGE);
  });

  bot.on("message:text", async (ctx) => {
    const commandEntity = ctx.message.entities?.find(
      (entity) => entity.type === "bot_command" && entity.offset === 0,
    );

    if (!commandEntity) {
      return;
    }

    const command = ctx.message.text
      .slice(1, commandEntity.length)
      .split("@", 1)[0];

    if (command === "start") {
      return;
    }

    await ctx.reply(UNKNOWN_COMMAND_MESSAGE);
  });

  bot.catch(() => {
    process.stderr.write(
      "[telegram-bot] Update handling failed; details omitted for security.\n",
    );
  });

  return bot;
}
