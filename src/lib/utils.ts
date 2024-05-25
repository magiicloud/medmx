import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (error: unknown) => {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object") {
    message = JSON.stringify(error);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "An error occurred";
  }
  return message;
};
