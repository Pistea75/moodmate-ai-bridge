
import { ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  
  return (
    <div className="min-h-screen flex flex-col">
      {!isLandingPage && (
        <header className="border-b shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-mood-purple to-mood-purple-light flex items-center justify-center">
                <span className="font-bold text-white">M</span>
              </div>
              <span className="text-xl font-semibold text-mood-purple">MoodMate</span>
            </Link>
          </div>
        </header>
      )}
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-4 bg-muted/30">
        <div className="container mx-auto px-4 text-sm text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} MoodMate. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
