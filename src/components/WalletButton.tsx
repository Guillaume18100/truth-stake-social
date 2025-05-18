
import React from 'react';
import { Button } from '@/components/ui/button';
import { LinkIcon } from 'lucide-react';

interface WalletButtonProps {
  address?: string;
  onConnect: () => void;
}

const WalletButton = ({ address, onConnect }: WalletButtonProps) => {
  return (
    <Button 
      onClick={onConnect}
      className="fixed top-4 right-4 bg-orange hover:bg-orange-light transition-colors"
    >
      {address ? (
        <span className="flex items-center gap-2">
          <LinkIcon className="h-4 w-4" />
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </span>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  );
};

export default WalletButton;
