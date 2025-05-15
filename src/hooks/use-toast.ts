
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

// This is what our component needs
export type ToasterToast = ToastProps & {
  id: string;
  action?: React.ReactNode;
};

export function useToast() {
  // Create an empty toasts array to prevent the map error
  const toasts: ToasterToast[] = [];
  
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    if (variant === "destructive") {
      sonnerToast.error(title, {
        description,
      });
    } else {
      sonnerToast(title, {
        description,
      });
    }
  };

  return { 
    toast,
    toasts 
  };
}

export const toast = ({ title, description, variant = "default" }: ToastProps) => {
  if (variant === "destructive") {
    sonnerToast.error(title, {
      description,
    });
  } else {
    sonnerToast(title, {
      description,
    });
  }
};
