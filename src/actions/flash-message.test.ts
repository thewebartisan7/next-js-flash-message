import { describe, expect, test, vi } from "vitest";
import { flashMessage, setFlashMessage } from "./flash-message.js";

const cache = new Map<string, string>();

vi.mock("next/headers", () => {
  return {
    cookies: () => {
      return {
        get(key: string) {
          return {
            value: cache.get(key),
          };
        },
        set(key: string, value: string) {
          cache.set(key, value);
        },
        delete(key: string) {
          cache.delete(key);
        },
      };
    },
  };
});

describe("flashMessage", () => {
  test("can create flash message passing message as a string via first argument", async () => {
    const message = "Default flash message";

    await flashMessage(message);

    expect(await flashMessage()).toStrictEqual({
      level: undefined,
      message,
      options: {
        description: undefined,
        duration: undefined,
        position: undefined,
        closeButton: undefined,
      },
    });
  });

  test("can create flash message passing message as a string via first argument and level via second argument", async () => {
    const message = "Error flash message";
    const level = "error";

    await flashMessage(message, level);

    expect(await flashMessage()).toStrictEqual({
      level,
      message,
      options: {
        description: undefined,
        duration: undefined,
        position: undefined,
        closeButton: undefined,
      },
    });
  });

  test("can create flash message passing message as a string via first argument, level via second argument and description as third argument", async () => {
    const message = "Info flash message with description";
    const description = "Flash message description";
    const level = "info";

    await flashMessage(message, level, description);

    expect(await flashMessage()).toStrictEqual({
      level,
      message,
      options: {
        description,
        duration: undefined,
        position: undefined,
        closeButton: undefined,
      },
    });
  });

  test("can create flash message passing an object as first argument with message, level and description", async () => {
    const message = "Success flash message with description";
    const description = "Flash message description";
    const level = "success";

    await flashMessage({ message, level, description });

    expect(await flashMessage()).toStrictEqual({
      level,
      message,
      options: {
        description,
        duration: undefined,
        position: undefined,
        closeButton: undefined,
      },
    });
  });

  test("can create flash message by setting duration and position", async () => {
    const message = "Info flash message with description";
    const description = "Flash message description";
    const level = "info";
    const duration = 2000;
    const position = "top-center";

    await flashMessage({
      message,
      level,
      description,
      duration,
      position,
    });

    expect(await flashMessage()).toStrictEqual({
      level,
      message,
      options: {
        description,
        duration,
        position,
        closeButton: undefined,
      },
    });
  });

  test("can create flash message with Infinity duration and close button", async () => {
    const message = "Infinity flash message";
    const duration = Infinity;
    const closeButton = true;

    await flashMessage({
      message,
      duration,
      closeButton,
    });

    expect(await flashMessage()).toStrictEqual({
      level: undefined,
      message,
      options: {
        description: undefined,
        duration,
        position: undefined,
        closeButton,
      },
    });
  });

  test("throw error if message is not passed via object argument", async () => {
    const invalidMessageKey = "Info flash message with description";

    await expect(setFlashMessage({ invalidMessageKey } as any)).rejects.toThrow(
      "Invalid flash message format.",
    );
  });

  test("message is deleted from cache after being retrieved", async () => {
    await flashMessage("Flash message");

    await flashMessage();

    expect(await flashMessage()).toBe(null);
  });
});
