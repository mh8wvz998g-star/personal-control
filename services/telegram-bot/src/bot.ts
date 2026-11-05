import { Bot, Context, Keyboard } from "grammy";

const START_MESSAGE =
  "👋 Добро пожаловать!\n\n" +
  "Добро пожаловать в систему учета «Фили».\n\n" +
  "Здесь вы можете:\n" +
  "📚 Контролировать сроки медицинских книжек.\n" +
  "📋 Работать с чек-листами и фотоотчётами.\n" +
  "📝 Получать дополнительные задания.\n" +
  "🔔 Участвовать в рассылках КРО.\n\n" +
  "Выберите нужный раздел в меню ниже.";

const createMainMenu = (webAppUrl: string, showWebApp: boolean) => {
  const keyboard = new Keyboard();

  if (showWebApp) {
    keyboard.webApp("🌐 Открыть Фили", webAppUrl).row();
  }

  return keyboard
    .text("👤 Администраторы")
    .text("📋 Чек-листы")
    .row()
    .text("📝 Задания")
    .text("🔔 КРО")
    .row()
    .text("📚 Медкнижки")
    .text("⚙️ Настройки")
    .resized();
};

const medicalBooksMenu = new Keyboard()
  .text("➕ Добавить медкнижку")
  .row()
  .text("📋 Список медкнижек")
  .row()
  .text("🔔 Проверить сроки")
  .row()
  .text("⬅️ Главное меню")
  .resized();

export function createBot(token: string, webAppUrl: string): Bot {
  const bot = new Bot(token);
  const getMainMenu = (ctx: Context) =>
  createMainMenu(webAppUrl, ctx.from?.id === 641021114);

  const lastBotMessage = new Map<number, number>();

  const sendReply = async (
  ctx: Context,
  text: string,
  keyboard?: Keyboard,
) => {
  const chatId = ctx.chat?.id;
  const previousId = chatId ? lastBotMessage.get(chatId) : undefined;

  if (chatId && previousId) {
    try {
      await ctx.api.deleteMessage(chatId, previousId);
    } catch {
      // Если сообщение уже удалено, продолжаем работу.
    }
  }

  const sent = await ctx.reply(
    text,
    keyboard ? { reply_markup: keyboard } : {},
  );

  if (chatId) lastBotMessage.set(chatId, sent.message_id);
};

  bot.command("start", async (ctx) => {
    const telegramId = ctx.from?.id;
    if (!telegramId) return;

    await sendReply(ctx, START_MESSAGE, getMainMenu(ctx));
  });

  bot.on("message:text", async (ctx) => {
    const text = ctx.message.text;

    if (text.startsWith("/")) return;

    const sections: Record<string, string> = {
  "📚 Медкнижки":
    "Раздел «Медкнижки» готовится к подключению.",
  "📋 Чек-листы":
    "Раздел «Чек-листы и фотоотчёты» готовится к подключению.",
  "📝 Задания":
    "Раздел «Дополнительные задания» готовится к подключению.",
  "🔔 КРО":
    "Раздел КРО готовится к подключению. Перед рассылкой будет отсчёт 10 секунд с возможностью отмены.",
  "👤 Администраторы":
    "Раздел «Управление администраторами» готовится к подключению.",
  "⚙️ Настройки":
    "Раздел «Настройки и права доступа» готовится к подключению.",
};

if (text === "📚 Медкнижки") {
  await sendReply(
  ctx,
  "📚 Раздел «Медкнижки»\n\nВыберите действие:",
  medicalBooksMenu,
);

  return;
}

if (text === "⬅️ Главное меню") {
  await ctx.reply("🏠 Главное меню. Выберите раздел:", {
    reply_markup: getMainMenu(ctx),
  });
  return;
}

    const response = sections[text];

    if (response) {
      await sendReply(ctx, response, getMainMenu(ctx));
    }
  });

  bot.catch(() => {
    process.stderr.write(
      "[telegram-bot] Update handling failed; details omitted for security.\n",
    );
  });

  return bot;
}