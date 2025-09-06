import React from 'react';

interface BlankPageProps {
  message: string;
}

export const BlankPage: React.FC<BlankPageProps> = ({ message }) => {
  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          {message}
        </h1>
        <div className="w-24 h-1 bg-primary mx-auto rounded"></div>
      </div>
    </div>
  );
};