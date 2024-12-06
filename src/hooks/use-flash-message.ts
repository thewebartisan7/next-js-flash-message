import { useEffect } from "react";
import { toast } from "sonner";
import { flashMessage } from "../actions/flash-message.js";

export const useFlashMessage = () => {
  useEffect(() => {
    const showFlashMessage = async () => {
      const flash = await flashMessage();

      if (flash) {
        if (flash.level) {
          toast[flash.level](flash.message, flash.options);
        } else {
          toast(flash.message, flash.options);
        }
      }
    };

    showFlashMessage();
  }, []);
};
