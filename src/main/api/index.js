const OpenAI = require("openai");
const { log, windows } = require("../utils");

let openai = null;

function initApi(key) {
  openai = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: key
  });
  log.info("init openai success.", key);
} 

async function chat(content) {
  if (!openai) {
    throw new Error("请先初始化openai");
  }
  log.info("send chat message.", content);
  const stream = await openai.chat.completions.create({
    messages: [{ role: "user", content }],
    model: "deepseek-chat",
    stream: true
  });

  const mainWindow = windows.getWindow("main-window");
  for await (const chunk of stream) {
    await mainWindow.webContents.send("chat-message", chunk);
  }

  return { status: true, message: null, info: null };
}

module.exports = {
  initApi,
  chat
};
