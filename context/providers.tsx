import HeaderAndSideBarProvider from './headerAndSidebar';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeaderAndSideBarProvider>
            {children}
        </HeaderAndSideBarProvider>
    );
}
