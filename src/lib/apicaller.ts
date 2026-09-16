import { ToastFunction } from "@/components/ui/use-toast";
 

export async function makeApiCall<T = any>(
  serverCall: () => Promise<T> | T,
  {
    toastContent,
    toast,
    afterSuccess,
    afterError,
    forceShutdown = false,
  }: {
    toastContent?: string;
    toast?: ToastFunction;
    afterSuccess?: (data: T) => void;
    afterError?: (error: Error) => void;
    forceShutdown?: boolean;
  }
): Promise<T> {
  try {
    const response = await serverCall();

    if (afterSuccess) afterSuccess(response as T);
    if (toast) {
      const currentToast = toast({
        description: toastContent,
      });
      setTimeout(() => {
        currentToast.dismiss();
      }, 2000);
    }
    // Always return the response regardless of toast
    return response as T;
  } catch (error: any) {
    const err = error instanceof Error ? error : new Error(String(error));
    if (afterError) afterError(err);
    if (toast && !forceShutdown) {
      const currentToast = toast({
        variant: "destructive",
        description: err.message ? (err.message as string) : "An Error Occured",
      });
      setTimeout(() => {
        currentToast.dismiss();
      }, 3000);
    } else {
      console.log(err);
    }
    throw err;
  }
}
