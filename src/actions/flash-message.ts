"use server";

// TODO add function overload for flashMessage and setFlashMessage

import { cookies } from "next/headers.js";

export type FlashMessageLevel = "info" | "success" | "warning" | "error";

type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type FlashMessage = {
  message: string;
  level?: FlashMessageLevel;
  description?: string;
  duration?: number;
  position?: ToastPosition;
  closeButton?: boolean;
  options?: {
    description?: string;
    duration?: number;
    position?: ToastPosition;
    closeButton?: boolean;
  };
};

const COOKIE_KEY = "flash";

// Validate level
const isValidLevel = (level: unknown): level is FlashMessageLevel =>
  typeof level === "string" &&
  ["info", "success", "warning", "error"].includes(level);

// Validate message
const isValidMessage = (message: unknown): message is FlashMessage =>
  !!message &&
  typeof message === "object" &&
  "message" in message &&
  typeof message.message === "string";

const toJson = (message: FlashMessage) => {
  return JSON.stringify(message, (key, value) => {
    if (key === "duration" && value == Infinity) {
      return "Infinity";
    }

    return value;
  });
};

const fromJson = (message: string) => {
  return JSON.parse(message, (key, value) => {
    if (key === "duration" && value === "Infinity") {
      return Infinity;
    }

    return value;
  });
};

/**
 * Retrieves and deletes the flash message stored in the cookie.
 * @returns The flash message object or null if not found.
 */
export const getFlashMessage = async (): Promise<FlashMessage | null> => {
  try {
    const cookieStore = await cookies();
    const rawMessage = cookieStore.get(COOKIE_KEY)?.value ?? null;
    cookieStore.delete(COOKIE_KEY);

    if (!rawMessage) {
      return null;
    }

    const parsedMessage = fromJson(rawMessage);

    if (isValidMessage(parsedMessage)) {
      return {
        message: parsedMessage.message,
        level: isValidLevel(parsedMessage.level)
          ? parsedMessage.level
          : undefined,
        options: {
          description:
            parsedMessage.options?.description ?? parsedMessage.description,
          duration: parsedMessage.options?.duration ?? parsedMessage.duration,
          position: parsedMessage.options?.position ?? parsedMessage.position,
          closeButton:
            parsedMessage.options?.closeButton ?? parsedMessage.closeButton,
        },
      };
    }

    throw new Error("Invalid flash message format in cookie.");
  } catch (error) {
    console.error("Failed to retrieve or delete flash message.", error);
    return null;
  }
};

/**
 * Sets a flash message, ensuring all messages are stored as objects.
 * @param message The flash message, which can be a string or structured message.
 * @param level Optional message level (info, success, warning, error).
 */
export async function setFlashMessage(
  message: string,
  level?: FlashMessageLevel,
  description?: string,
): Promise<void>;
export async function setFlashMessage(message: FlashMessage): Promise<void>;
export async function setFlashMessage(
  message: string | FlashMessage,
  level?: FlashMessageLevel,
  description?: string,
): Promise<void> {
  try {
    let messageToStore: FlashMessage;

    if (typeof message === "string") {
      if (level && !isValidLevel(level)) {
        throw new Error(`Invalid flash message level: ${level}`);
      } else {
        messageToStore = { message, level, description };
      }
    } else if (isValidMessage(message)) {
      messageToStore = {
        ...message,
        level: isValidLevel(message.level) ? message.level : undefined,
      };
    } else {
      console.error("Invalid flash message format.", { message });
      throw new Error("Invalid flash message format.");
    }

    (await cookies()).set(COOKIE_KEY, toJson(messageToStore));
  } catch (error) {
    console.error("Failed to set flash message", error);
    throw error;
  }
}

/**
 * Sets a flash message and stores it, if provided, or return from cookie when not provided.
 * @param message Optional string message.
 * @param level Optional level (info, success, warning, error).
 */
export async function flashMessage(): Promise<FlashMessage | null>;
export async function flashMessage(
  message: string,
  level?: FlashMessageLevel,
  description?: string,
): Promise<void>;
export async function flashMessage(message: FlashMessage): Promise<void>;
export async function flashMessage(
  message?: string | FlashMessage,
  level?: FlashMessageLevel,
  description?: string,
): Promise<void | FlashMessage | null> {
  try {
    if (typeof message === "string") {
      await setFlashMessage(message, level, description);
    } else if (typeof message === "object") {
      await setFlashMessage(message);
    } else {
      return await getFlashMessage();
    }
  } catch (error) {
    console.error("Failed to handle flash message.", error);
  }
}
