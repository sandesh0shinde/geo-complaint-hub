
import { useToast as useToastOriginal, toast } from "@/hooks/use-toast";

export const useToast = () => {
  const originalToast = useToastOriginal();
  return {
    ...originalToast,
    toasts: originalToast.toasts || []
  };
};

export { toast };
