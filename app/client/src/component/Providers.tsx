'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface Props {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 5,
      keepPreviousData: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retryOnMount: false,
      staleTime: 1000 * 60,
      suspense: true,
      useErrorBoundary: true,
    },
  },
});

const Providers = ({ children }: Props) => {
  return (
    <ErrorBoundary fallback={<div>Error</div>}>
      <Suspense fallback={<div>Suspense</div>}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Suspense>
    </ErrorBoundary>
  );
};

export default Providers;
