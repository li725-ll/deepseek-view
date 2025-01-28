const OpenAI = require("openai");
const { log, windows } = require("../utils");

const config = {
  openai: null,
  model: "deepseek-chat"
}

function initApi(key) {
  config.openai = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: key
  });
  log.info("init openai success.");
} 

function setModel (model) {
  config.model = model;
}

async function chat(messages) {
  if (!config.openai) {
    throw new Error("请先初始化openai");
  }
  log.info("send chat message.", messages);
  try {
    const stream = await config.openai.chat.completions.create({
      messages,
      model: config.model,
      stream: true
    });

    const mainWindow = windows.getWindow("main-window");
    for await (const chunk of stream) {
      await mainWindow.webContents.send("chat-message", chunk);
    }
  } catch (e) {
    console.log(e);
    return {status: false, message: e.error.message, info: null}
  }

  return { status: true, message: null, info: null };
}

module.exports = {
  chat,
  initApi,
  setModel
};
