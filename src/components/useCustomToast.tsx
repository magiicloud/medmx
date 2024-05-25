import { useToast } from "@/components/ui/use-toast";

const useCustomToast = () => {
  const { toast } = useToast();

  const displayToast = (
    variant?: "default" | "destructive" | null | undefined,
    title?: string | undefined,
    description?: React.ReactNode | undefined
  ) => {
    toast({
      variant: variant,
      title: title,
      description: description,
    });
  };

  return { displayToast };
};

export default useCustomToast;
