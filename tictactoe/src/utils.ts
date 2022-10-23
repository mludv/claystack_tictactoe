import { useState } from "react";

/**
 * Hook for simplifing async functions
 */
export function useAsync<T>(func: (...args: any[]) => Promise<T>) {
  const [state, setState] = useState<{
    loading: boolean;
    error?: Error;
    data?: T;
  }>({ loading: false });

  const run = (...args: any[]) => {
    setState({ loading: true });
    func(...args)
      .then((data) => setState({ loading: false, data }))
      .catch((error: Error) => {
        console.error(error);
        setState({ loading: false, error });
      });
  };

  return { ...state, run };
}
