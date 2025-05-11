
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-6 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-medical-primary">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
            <span className="text-xl font-bold text-medical-primary">MediRecord</span>
          </Link>
        </div>
      </header>

      <div className="flex-1">
        {children}
      </div>
      
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto py-4 px-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} MediRecord. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
