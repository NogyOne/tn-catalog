import { Toaster } from "@components/ui/sonner";
import { toast } from "sonner";
import { useEffect } from "react";

export default function ToastListener() {
  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { type, message, errorMessage, loadingMessage, promise } =
        customEvent.detail;

      switch (type) {
        case "success":
          toast.success(message);
          break;
        case "error":
          toast.error(message);
          break;
        case "promise":
          toast.promise(promise, {
            loading: loadingMessage,
            success: message,
            error: errorMessage,
          });
          break;
        default:
          toast.info(message);
      }
    };

    window.addEventListener("toast", handleToast as EventListener);

    return () => {
      window.removeEventListener("toast", handleToast as EventListener);
    };
  }, []);

  return <Toaster position="top-left" richColors />;
}
