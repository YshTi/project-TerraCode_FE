import { toast } from "react-hot-toast";

import { Notification } from "@/components/toaster/notification";

const TOAST_DURATION = 4000;

function showNotification(
  type: "success" | "error" | "info",
  message: string
) {
  toast.custom(
    () => <Notification type={type} message={message} />,
    {
      duration: TOAST_DURATION,
    }
  );
}

export const notify = {
  success: (message: string) => showNotification("success", message),
  error: (message: string) => showNotification("error", message),
  info: (message: string) => showNotification("info", message),
};