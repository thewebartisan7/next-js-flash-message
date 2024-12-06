"use client";

import { useFlashMessage } from "../hooks/use-flash-message.js";

const FlashMessageProvider = () => {
  useFlashMessage();

  return null;
};

export { FlashMessageProvider };
