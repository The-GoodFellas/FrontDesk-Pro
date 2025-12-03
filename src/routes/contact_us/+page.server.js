import { json, fail } from "@sveltejs/kit";
import fs from "node:fs";
import path from "node:path";

const messagesFile = path.resolve("db/messages.json");

function loadMessages() {
  try {
    const data = fs.readFileSync(messagesFile, "utf8");
    return JSON.parse(data);
  } catch (e) {
    // If file doesn't exist, start a new array
    return [];
  }
}

function saveMessages(messages) {
  fs.mkdirSync(path.dirname(messagesFile), { recursive: true });
  fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
}

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !message || !/.+@.+\..+/.test(email)) {
      return fail(400, { success: false, error: "Please provide name, valid email, and message." });
    }

    const messages = loadMessages();
    messages.push({
      name,
      email,
      message,
      created_at: new Date().toISOString(),
    });
    saveMessages(messages);

    return { success: true };
  },
};
