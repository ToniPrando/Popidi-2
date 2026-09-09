import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { NeonLogo } from './NeonLogo';
import { getCleanWhatsAppNumber } from '../utils/formatters';
import { 
  MapPin, 
  Menu as MenuIcon, 
  X,
  Bike,
  Beer,
  UtensilsCrossed,
  Sparkles,
  User,
  LogOut,
  ChevronDown,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeOrder,
    setIsOrderTrackerOpen,
    storeSettings,
    navigateToCategory
  } = useCart();

  const {
    user,
    profile,
    logout
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#08080c]/95 backdrop-blur-md border-b border-fuchsia-950/60 shadow-2xl">
      {/* Top Notification Announcement Bar */}
      {storeSettings.activeBannerAnnouncement && (
        <div className="bg-gradient-to-r from-fuchsia-950 via-zinc-950 to-emerald-950 border-b border-fuchsia-900/40 text-zinc-100 py-1.5 px-4 text-xs font-bold tracking-wide flex items-center justify-center gap-2 overflow-hidden shadow-inner">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#00ff66]" />
          <span className="truncate text-fuchsia-300 font-extrabold uppercase">{storeSettings.activeBannerAnnouncement}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Left Brand Logo (without text) */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#" className="flex items-center group" title="Início">
              <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center group-hover:scale-105 transition-transform">
                <NeonLogo size="sm" showSubtitle={false} />
              </div>
            </a>
          </div>

          {/* Centered Navigation Menu with Greater Spacing */}
          <nav className="hidden lg:flex items-center justify-center gap-3 xl:gap-6 bg-zinc-950/90 px-6 py-2.5 rounded-2xl border border-zinc-800/80 shadow-2xl mx-auto">
            <a 
              href="#" 
              className="px-3.5 py-2 text-sm font-bold text-zinc-300 hover:text-emerald-400 hover:bg-zinc-900 rounded-xl transition-all"
            >
              Início
            </a>
            <a 
              href="#cardapio" 
              className="px-3.5 py-2 text-sm font-bold text-zinc-300 hover:text-emerald-400 hover:bg-zinc-900 rounded-xl transition-all flex items-center gap-2"
            >
              <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
              <span>Cardápio</span>
            </a>
            <button
              type="button"
              onClick={() => navigateToCategory('choperia')}
              className="px-3.5 py-2 text-sm font-bold text-zinc-300 hover:text-yellow-400 hover:bg-zinc-900 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Beer className="w-4 h-4 text-yellow-400" />
              <span>Choperia</span>
            </button>
            <a 
              href="#o-famoso-xtudo" 
              className="px-3.5 py-2 text-sm font-bold text-fuchsia-300 hover:text-fuchsia-200 hover:bg-fuchsia-950/40 rounded-xl transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>X-Tudo</span>
            </a>
            <a 
              href="#localizacao" 
              className="px-3.5 py-2 text-sm font-bold text-zinc-300 hover:text-fuchsia-300 hover:bg-zinc-900 rounded-xl transition-all flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-fuchsia-400" />
              <span>Localização</span>
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Delivery & Ordering Buttons (Right side of Header) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* WhatsApp Direct Order Link */}
              <a 
                id="header-btn-whatsapp"
                href={`https://wa.me/${getCleanWhatsAppNumber(storeSettings.phoneWhatsApp)}?text=${encodeURIComponent('Olá! Gostaria de fazer um pedido na PO-PI-DI Hamburgueria.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 sm:px-3.5 py-2 text-xs font-black text-black bg-[#25D366] hover:bg-[#20ba59] border border-emerald-300/50 rounded-xl transition-all flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-98"
                title="Pedir no WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-black fill-current shrink-0" />
                <span className="hidden sm:inline">Pedir no WhatsApp</span>
                <span className="sm:hidden text-[11px] font-black">WhatsApp</span>
              </a>

              {/* iFood External Link */}
              <a 
                id="header-btn-ifood"
                href={storeSettings.ifoodUrl || "https://www.ifood.com.br/delivery/porto-feliz-sp/po-pi-di-chacara-sanches/28f7250f-5a04-45cd-92ed-9b371d51726e"} 
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 sm:px-3 py-2 text-xs font-black text-red-300 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                title="Pedir no iFood"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                <span className="hidden md:inline">Pedir no iFood</span>
                <span className="md:hidden text-[11px] font-black">iFood</span>
                <ExternalLink className="w-3 h-3 opacity-80 shrink-0" />
              </a>

              {/* Anota.ai External Link */}
              <a 
                id="header-btn-anotaai"
                href={storeSettings.anotaAiUrl || "https://pedido.anota.ai/loja/nova-loja-burger"} 
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex px-2.5 sm:px-3 py-2 text-xs font-black text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-xl transition-all items-center gap-1.5 shadow-sm"
                title="Cardápio Anota.ai"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="hidden lg:inline">Cardápio Anota.ai</span>
                <span className="lg:hidden text-[11px] font-black">Anota.ai</span>
                <ExternalLink className="w-3 h-3 opacity-80 shrink-0" />
              </a>
            </div>
            
            {/* Active Order Tracker Pill - Only shown when active order exists */}
            {activeOrder && activeOrder.status !== 'completed' && activeOrder.status !== 'cancelled' && (
              <button
                id="btn-active-order-tracker"
                onClick={() => setIsOrderTrackerOpen(true)}
                className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,255,102,0.2)] animate-pulse cursor-pointer"
                title="Acompanhar pedido em tempo real"
              >
                <Bike className="w-4 h-4" />
                <span className="hidden sm:inline">Acompanhar</span>
                <span>{activeOrder.shortCode}</span>
              </button>
            )}

            {/* Logged Customer Account Menu (if authenticated) */}
            {(user || profile) && (
              <div className="relative">
                <button
                  id="btn-user-account-menu"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 text-xs font-bold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors"
                >
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-6 h-6 rounded-full object-cover border border-emerald-400" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 font-black text-xs">
                      {(profile?.name || user?.displayName || 'C').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline max-w-[90px] truncate">{profile?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Minha Conta'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                </button>

                {/* Dropdown for logged customer */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0e0914] border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                      <p className="text-xs font-black text-white truncate">{profile?.name || user?.displayName || 'Cliente'}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{profile?.email || user?.email || profile?.phone || ''}</p>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl transition-colors text-left border-t border-zinc-800/80 pt-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair da Conta</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-zinc-400 hover:text-white bg-zinc-900 rounded-xl border border-zinc-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0a0f] border-b border-fuchsia-950/70 px-4 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          
          {/* Centered Navigation Links with Greater Spacing */}
          <div className="grid grid-cols-2 gap-3 py-2 border-b border-zinc-800/80">
            <a 
              href="#" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-zinc-900 text-zinc-200 rounded-xl text-xs font-bold text-center hover:bg-zinc-800 transition-colors"
            >
              🍔 Início
            </a>
            <a 
              href="#cardapio" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-zinc-900 text-emerald-400 rounded-xl text-xs font-bold text-center hover:bg-zinc-800 transition-colors"
            >
              📋 Cardápio
            </a>
            <button 
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigateToCategory('choperia');
              }}
              className="px-4 py-3 bg-zinc-900 text-yellow-400 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              🍺 Choperia
            </button>
            <a 
              href="#o-famoso-xtudo" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-fuchsia-950/60 text-fuchsia-300 border border-fuchsia-800/40 rounded-xl text-xs font-bold text-center hover:bg-fuchsia-900/60 transition-colors"
            >
              ✨ X-Tudo
            </a>
            <a 
              href="#localizacao" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-zinc-900 text-zinc-300 rounded-xl text-xs font-bold text-center col-span-2 hover:bg-zinc-800 transition-colors"
            >
              📍 Localização & Mapa
            </a>

            {/* WhatsApp, iFood & Anota.ai Delivery Platform Links */}
            <a 
              href={`https://wa.me/${getCleanWhatsAppNumber(storeSettings.phoneWhatsApp)}?text=${encodeURIComponent('Olá! Gostaria de fazer um pedido na PO-PI-DI Hamburgueria.')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-emerald-300 border border-[#25D366]/50 rounded-xl text-xs font-black text-center flex items-center justify-center gap-2 col-span-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Pedir pelo WhatsApp</span>
            </a>
            <a 
              href={storeSettings.ifoodUrl || "https://www.ifood.com.br/delivery/porto-feliz-sp/po-pi-di-chacara-sanches/28f7250f-5a04-45cd-92ed-9b371d51726e"} 
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-red-950/50 text-red-300 border border-red-800/40 rounded-xl text-xs font-black text-center flex items-center justify-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Pedir no iFood</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a 
              href={storeSettings.anotaAiUrl || "https://pedido.anota.ai/loja/nova-loja-burger"} 
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-emerald-950/50 text-emerald-300 border border-emerald-800/40 rounded-xl text-xs font-black text-center flex items-center justify-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Cardápio Anota.ai</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {(user || profile) && (
            <div className="p-3 bg-zinc-900/60 rounded-2xl border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">{profile?.name || user?.displayName || user?.email || profile?.phone}</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full">Conectado</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full py-2 px-3 bg-red-950/40 text-xs font-bold text-red-400 rounded-xl border border-red-900/40"
              >
                Sair da Conta
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
