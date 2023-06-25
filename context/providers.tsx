'use client';

import { ReactNode } from "react";
import { UseCommunityDataProvider } from "./useCommunityData";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <UseCommunityDataProvider>
            {children}
        </UseCommunityDataProvider>
    );
}