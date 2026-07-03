import { GoogleGenAI, Type } from "@google/genai";
import { Item, CONDITION_LABEL, idleLabel } from "./items";

const API_KEY_STORAGE_KEY = "idle-inventory.gemini.apikey";

export function getApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

export function saveApiKey(key: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
}

export function removeApiKey() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

export interface XhsCopywriting {
  title: string;
  body: string;
  tags: string;
  commentGuide: string;
}

const XHS_DIRECTOR_PROMPT = `你是一个深谙小红书流量密码的资深文案专家。你的任务是帮用户把二手闲置物品转化为一篇极具种草力和信任感的小红书图文文案。

针对二手闲置（断舍离/极简生活领域），你的文案需要：
- 真诚大于完美。
- 强调使用痕迹或闲置原因，建立真实感和信任。
- 语气轻松、有网感，适当使用 Emoji。

我会提供一个二手物品的详细信息。请你严格按照 JSON 格式，直接输出小红书爆款文案（包含标题、正文、标签和首评引导）。`;

export async function generateXhsCopy(item: Item): Promise<XhsCopywriting> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Missing Gemini API Key");
  }

  // Initialize the SDK
  const ai = new GoogleGenAI({ apiKey });

  const idleText = idleLabel(item.dateAdded).replace("已闲置 ", "");

  const itemContext = `
物品名称: ${item.name}
类别: ${item.category}
成色: ${CONDITION_LABEL[item.condition]}
闲置时间: ${idleText}
预期售价: ￥${item.expectedPrice}
用户备注: ${item.notes || "无"}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: [{ role: "user", parts: [{ text: itemContext }] }],
    config: {
      systemInstruction: XHS_DIRECTOR_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "吸引眼球的小红书爆款标题，加入适当的 Emoji" },
          body: {
            type: Type.STRING,
            description:
              "小红书正文。自然融入物品成色、闲置时间、出售原因等信息，行文要有呼吸感（空行）。",
          },
          tags: {
            type: Type.STRING,
            description: "空格分隔的标签，例如 #断舍离 #二手闲置 #好物分享",
          },
          commentGuide: {
            type: Type.STRING,
            description: "发在评论区的第一句话，用来引导用户提问或互动",
          },
        },
        required: ["title", "body", "tags", "commentGuide"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");

  return JSON.parse(text) as XhsCopywriting;
}
