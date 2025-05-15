
import { useToast as useToastOriginal, toast } from "@/hooks/use-toast";

// Create a wrapper for useToast to ensure it returns the expected toasts array
export const useToast = () => {
  const originalToast = useToastOriginal();
  return {
    ...originalToast,
    toasts: [] // Add empty toasts array to satisfy the Toaster component
  };
};

export { toast };
