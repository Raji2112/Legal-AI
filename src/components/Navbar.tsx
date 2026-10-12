import React, { useState } from "react";
import { Scale, FileText, History, Cpu, Info, Menu, X, Upload } from "lucide-react";
import { NavTab } from "../types.js";

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onQuickUpload: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onQuickUpload,
  historyCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode; badge?: number }> = [
    { id: "dashboard", label: "Dashboard", icon: <Scale className="w-4 h-4" /> },
    { id: "analyze", label: "Analyze Document", icon: <FileText className="w-4 h-4" /> },
    { id: "history", label: "Analysis History", icon: <History className="w-4 h-4" />, badge: historyCount },
    { id: "architecture", label: "Architecture & Tech", icon: <Cpu className="w-4 h-4" /> },
    { id: "about", label: "About & Legal", icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B192C]/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => onSelectTab("dashboard")}
            className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#0A1931] border border-[#C5A880]/40 flex items-center justify-center text-[#E5C378] shadow-inner group-hover:border-[#C5A880] transition-colors">
              <Scale className="w-5 h-5 text-[#E5C378]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-legal font-bold text-lg tracking-wide text-white group-hover:text-[#E5C378] transition-colors">
                  LexiScan
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-[#C5A880]/20 text-[#E5C378] border border-[#C5A880]/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 tracking-wider hidden sm:block">
                LEGAL DOCUMENT INTELLIGENCE
              </p>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs lg:text-sm font-medium rounded-lg transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? "bg-slate-800/90 text-[#E5C378] shadow-sm border border-slate-700/80"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <span className="ml-1 text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-slate-700 text-slate-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onQuickUpload}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-[#C5A880] to-[#D4AF37] text-slate-950 hover:brightness-110 active:brightness-95 transition-all shadow-sm shadow-[#C5A880]/20 whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Analyze Contract</span>
            </button>

            {/* Mobile Drawer Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0B192C] px-4 pt-3 pb-4 space-y-1 shadow-2xl">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-800 text-[#E5C378] border border-slate-700 font-semibold"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {typeof item.badge === "number" && item.badge > 0 && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-700 text-slate-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
