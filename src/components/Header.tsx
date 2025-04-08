import React from "react";
import ModeToggle from "./mode-toggle";
import AlertsManager from "./AlertsManager";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <img src="/icons/himcoin.png" alt="HimCoin Logo" className="w-8 h-8" />
        <h1 className="text-2xl font-bold">HimCoin</h1>
      </div>
      <div className="flex items-center gap-4">
        <AlertsManager />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.open("https://github.com/yourusername/himcoin", "_blank")}
          className="hover:bg-muted"
        >
          <Github className="h-5 w-5" />
        </Button>
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
