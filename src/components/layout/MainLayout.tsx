import * as React from "react";
import { cn } from "@/lib/utils";

interface MainLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const MainLayout = React.forwardRef<HTMLDivElement, MainLayoutProps>(
  ({ className, children, header, footer, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "min-h-screen flex flex-col bg-background",
          className
        )}
        {...props}
      >
        {header && (
          <header className="border-b bg-card shadow-sm">
            {header}
          </header>
        )}
        <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
        {footer && (
          <footer className="border-t bg-card mt-auto">
            {footer}
          </footer>
        )}
      </div>
    );
  }
);
MainLayout.displayName = "MainLayout";

interface MainLayoutHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

const MainLayoutHeader = React.forwardRef<HTMLDivElement, MainLayoutHeaderProps>(
  ({ className, title, description, actions, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 md:px-6 lg:px-8",
          className
        )}
        {...props}
      >
        <div className="flex-1">
          {children || (
            <>
              {title && (
                <h1 className="text-2xl font-semibold tracking-tight">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-muted-foreground text-sm mt-1">
                  {description}
                </p>
              )}
            </>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    );
  }
);
MainLayoutHeader.displayName = "MainLayoutHeader";

interface MainLayoutFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const MainLayoutFooter = React.forwardRef<HTMLDivElement, MainLayoutFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 md:px-6 lg:px-8 text-sm text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MainLayoutFooter.displayName = "MainLayoutFooter";

export { MainLayout, MainLayoutHeader, MainLayoutFooter };
