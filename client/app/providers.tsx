"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>{children}</MantineProvider>
    </QueryClientProvider>
  );
}
