import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatBRL } from '../utils/formatters';
import { 
  X, 
  ShieldCheck, 
  KeyRound,
  CheckCircle2, 
  ToggleLeft, 
  ToggleRight, 
  Package, 
  Sliders, 
  LogOut,
  Sparkles,
  Search,
  Maximize2,
  Minimize2,
  ChefHat,
  RefreshCw,
  Edit3,
  DollarSign,
  Store,
  Clock,
  Flame,
  Check,
  Tag,
  AlertTriangle,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { CategoryId } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    storeSettings,
    updateStoreSettings,
    menuItems,
    toggleItemAvailability,
    setIsMenuEditorOpen,
  } = useCart();

  const { isAdmin, adminLogout, setIsAdminLoginOpen } = useAuth();

  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'settings'>('overview');
  const [inventorySearch, setInventorySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [customPinInput, setCustomPinInput] = useState(storeSettings.adminPin || '1234');
  const [customPassInput, setCustomPassInput] = useState(storeSettings.adminPassword || 'popidi@2026');
  const [pinSavedFeedback, setPinSavedFeedback] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isAdminOpen) return null;

  // Strict Security Guard: If not logged in as admin, require password
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="max-w-sm w-full p-6 rounded-3xl bg-[#0e0914] border-2 border-yellow-500/50 text-center shadow-[0_0_40px_rgba(234,179,8,0.25)] space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400 shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Acesso do Gerente</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              O Painel do Gerente da Pó Pi Di permite editar o cardápio, fotos, valores, disponibilidade e informações do estabelecimento.
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsAdminOpen(false);
                setIsAdminLoginOpen(true);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-yellow-500/25 transition-all cursor-pointer"
            >
              Digitar Senha do Gerente
            </button>
            <button
              type="button"
              onClick={() => setIsAdminOpen(false)}
              className="w-full py-2.5 bg-zinc-900 text-zinc-400 hover:text-white text-xs font-bold rounded-xl border border-zinc-800 transition-colors cursor-pointer"
            >
              Voltar ao Cardápio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAdminSignOut = () => {
    adminLogout();
    setIsAdminOpen(false);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPinInput.trim() || !customPassInput.trim()) return;
    updateStoreSettings({
      adminPin: customPinInput.trim(),
      adminPassword: customPassInput.trim()
    });
    setPinSavedFeedback(true);
    setTimeout(() => setPinSavedFeedback(false), 3000);
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const availableCount = menuItems.filter(i => i.available).length;
  const soldOutCount = menuItems.filter(i => !i.available).length;

  const categories: { id: string; label: string }[] = [
    { id: 'todos', label: 'Todos os Itens' },
    { id: 'smash-burgers', label: 'Smash Burgers' },
    { id: 'artesanais', label: 'Burgers Artesanais' },
    { id: 'combos', label: 'Combos Especiais' },
    { id: 'porcoes', label: 'Porções & Entradas' },
    { id: 'choperia', label: 'Choperia & Cervejas' },
    { id: 'bebidas', label: 'Bebidas & Refrigerantes' },
    { id: 'sobremesas', label: 'Sobremesas' },
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'todos' || item.category === selectedCategory;
    const q = inventorySearch.toLowerCase().trim();
    const matchesSearch = !q || 
      item.name.toLowerCase().includes(q) || 
      item.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden bg-black/90 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-150 ${
      isMaximized ? 'p-0' : 'p-2 sm:p-4'
    }`}>
      <div 
        className={`relative bg-[#0b0d13] border border-zinc-800 shadow-2xl overflow-hidden flex flex-col text-left transition-all ${
          isMaximized 
            ? 'w-full h-full rounded-none max-w-none max-h-none'
            : 'w-full max-w-5xl rounded-3xl max-h-[92vh]'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-3.5 sm:p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-500 to-amber-600 text-black flex items-center justify-center font-black shadow-lg shadow-yellow-500/20 shrink-0">
              <ChefHat className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                  Painel do Gerente
                </h2>
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-2.5 py-0.5 rounded-full shadow-sm">
                  <ShieldCheck className="w-3 h-3 text-yellow-400" />
                  <span>Cardápio & Conteúdo</span>
                </span>
                <button
                  type="button"
                  onClick={handleManualRefresh}
                  className="flex items-center gap-1.5 text-[10px] font-bold bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 px-2 py-0.5 rounded-full transition-all cursor-pointer"
                  title="Atualizar dados"
                >
                  <RefreshCw className={`w-2.5 h-2.5 ${isRefreshing ? 'animate-spin text-yellow-400' : ''}`} />
                  <span>Sincronizado</span>
                </button>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Edição de produtos, fotos, valores, disponibilidade de estoque e informações da loja
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Primary Requested Action Button */}
            <button
              type="button"
              onClick={() => setIsMenuEditorOpen(true)}
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl border border-yellow-500/60 bg-gradient-to-r from-yellow-500/25 via-amber-500/20 to-yellow-500/25 hover:from-yellow-400 hover:to-amber-400 hover:text-black text-yellow-300 text-xs font-black flex items-center gap-2 transition-all shadow-md shadow-yellow-500/10 cursor-pointer active:scale-95"
              title="Cadastrar Novos Lanches, Alterar Preços, Fotos e Informações das Seções da Página"
            >
              <Sliders className="w-4 h-4 text-yellow-400 stroke-[2.5]" />
              <span className="font-black">Editar Cardápio e Informações</span>
            </button>

            {/* Maximize / Restore Toggle */}
            <button
              type="button"
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-2.5 text-zinc-300 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title={isMaximized ? 'Restaurar Janela' : 'Maximizar Tela'}
            >
              {isMaximized ? (
                <Minimize2 className="w-4 h-4 text-amber-400" />
              ) : (
                <Maximize2 className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Logout Admin */}
            <button
              type="button"
              onClick={handleAdminSignOut}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-red-400 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-900/40 transition-colors cursor-pointer"
              title="Sair do Modo Gerente"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden xl:inline">Sair</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsAdminOpen(false)}
              className="p-2.5 text-zinc-400 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Fechar Painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top KPI Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 bg-zinc-900/60 border-b border-zinc-800 p-3 sm:p-4 gap-2.5 text-xs shrink-0">
          <div className="p-3 bg-zinc-950 rounded-2xl border border-yellow-500/30 flex items-center justify-between">
            <div>
              <span className="text-zinc-400 block text-[11px] font-bold">Total no Cardápio</span>
              <span className="text-xl sm:text-2xl font-black text-yellow-400">{menuItems.length} itens</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3 bg-zinc-950 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-zinc-400 block text-[11px] font-bold">Itens Disponíveis</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400">{availableCount} ativos</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3 bg-zinc-950 rounded-2xl border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-zinc-400 block text-[11px] font-bold">Itens Esgotados</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400">{soldOutCount} pausados</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Tag className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-zinc-400 block text-[11px] font-bold">Status do Estabelecimento</span>
              <span className={`font-black text-xs sm:text-sm ${storeSettings.isOpen ? 'text-emerald-400' : 'text-red-400'}`}>
                {storeSettings.isOpen ? '● Aberto' : '● Fechado'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => updateStoreSettings({ isOpen: !storeSettings.isOpen })}
              className="text-zinc-400 hover:text-white p-1 cursor-pointer transition-transform active:scale-95"
              title="Alternar Aberto / Fechado"
            >
              {storeSettings.isOpen ? (
                <ToggleRight className="w-8 h-8 text-emerald-500" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-zinc-600" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/70 text-xs font-bold px-3 sm:px-5 shrink-0">
          <div className="flex gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3.5 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-yellow-500 text-yellow-400 bg-yellow-500/5 font-black'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Cardápio & Informações</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-3.5 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'inventory'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5 font-black'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Estoque & Disponibilidade ({menuItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-3.5 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'settings'
                  ? 'border-yellow-500 text-yellow-400 bg-yellow-500/5 font-black'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Configurações da Loja</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuEditorOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-black rounded-lg font-black text-xs hover:bg-yellow-400 transition-all cursor-pointer shadow"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Abrir Editor Completo</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#090b10] space-y-6">
          
          {/* TAB 1: CARDÁPIO & INFORMAÇÕES */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Primary Call-to-Action Hero Box */}
              <div className="p-6 sm:p-8 bg-gradient-to-r from-yellow-500/15 via-amber-500/10 to-yellow-500/5 border-2 border-yellow-500/30 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Central de Gestão do Cardápio</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Editar Cardápio, Fotos & Informações
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    Cadastre novos smash burgers e porções, atualize preços, insira fotos reais com visual neon, altere a manchete principal, horários de funcionamento e dados da unidade em Porto Feliz.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMenuEditorOpen(true)}
                  className="px-6 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-yellow-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3 shrink-0 cursor-pointer"
                >
                  <Sliders className="w-5 h-5 stroke-[2.5]" />
                  <span>Abrir Editor de Cardápio e Informações</span>
                </button>
              </div>

              {/* 4 Feature Shortcut Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div 
                  onClick={() => setIsMenuEditorOpen(true)}
                  className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 hover:border-yellow-500/50 transition-all cursor-pointer group hover:bg-zinc-900/60 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                      <ChefHat className="w-5 h-5" />
                    </div>
                    <h4 className="font-black text-sm text-white group-hover:text-yellow-400 transition-colors">
                      Lanches & Porções
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Cadastre novos produtos, edite nomes, descrições detalhadas e adicione adicionais e opções.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-zinc-850 flex items-center justify-between text-xs font-bold text-yellow-400">
                    <span>Gerenciar Itens</span>
                    <span>→</span>
                  </div>
                </div>

                <div 
                  onClick={() => setIsMenuEditorOpen(true)}
                  className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 hover:border-emerald-500/50 transition-all cursor-pointer group hover:bg-zinc-900/60 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <h4 className="font-black text-sm text-white group-hover:text-emerald-400 transition-colors">
                      Preços & Promoções
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Defina preços regulares, preços promocionais e aplique selos de &quot;Mais Vendido&quot; ou novidade.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-zinc-850 flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>Ajustar Valores</span>
                    <span>→</span>
                  </div>
                </div>

                <div 
                  onClick={() => setIsMenuEditorOpen(true)}
                  className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 hover:border-fuchsia-500/50 transition-all cursor-pointer group hover:bg-zinc-900/60 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <h4 className="font-black text-sm text-white group-hover:text-fuchsia-400 transition-colors">
                      Fotos & Imagens Neon
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Adicione fotos de alta qualidade para seus lanches, chopes, porções e imagens dos banners da página.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-zinc-850 flex items-center justify-between text-xs font-bold text-fuchsia-400">
                    <span>Trocar Fotos</span>
                    <span>→</span>
                  </div>
                </div>

                <div 
                  onClick={() => setIsMenuEditorOpen(true)}
                  className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 hover:border-cyan-500/50 transition-all cursor-pointer group hover:bg-zinc-900/60 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h4 className="font-black text-sm text-white group-hover:text-cyan-400 transition-colors">
                      Informações da Loja
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Atualize a manchete do topo, texto do rodapé, horários de abertura, endereço e WhatsApp oficial.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-zinc-850 flex items-center justify-between text-xs font-bold text-cyan-400">
                    <span>Editar Informações</span>
                    <span>→</span>
                  </div>
                </div>

              </div>

              {/* Quick Status Notice */}
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-zinc-300">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Sincronização em Nuvem ativa: todas as alterações salvas são refletidas instantaneamente no cardápio dos clientes.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuEditorOpen(true)}
                  className="text-xs font-bold text-yellow-400 hover:underline cursor-pointer shrink-0"
                >
                  Editar Cardápio agora ↗
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: ESTOQUE & DISPONIBILIDADE */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={e => setInventorySearch(e.target.value)}
                    placeholder="Buscar produto por nome ou descrição..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMenuEditorOpen(true)}
                    className="px-3 py-2 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar Itens no Cardápio</span>
                  </button>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-yellow-500 text-black font-black shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                      item.available
                        ? 'bg-zinc-950 border-zinc-800'
                        : 'bg-red-950/20 border-red-900/40 opacity-85'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                            {item.category}
                          </span>
                          <h4 className="font-bold text-sm text-white leading-tight">
                            {item.name}
                          </h4>
                        </div>
                        <span className="text-sm font-black text-amber-400 shrink-0">
                          {formatBRL(item.price)}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-zinc-850 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => toggleItemAvailability(item.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          item.available
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/25'
                        }`}
                        title={item.available ? "Clique para marcar como esgotado" : "Clique para reativar no cardápio"}
                      >
                        {item.available ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Disponível</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                            <span>Esgotado (Pausado)</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsMenuEditorOpen(true)}
                        className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-bold border border-zinc-800 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Editar detalhes no editor de cardápio"
                      >
                        <Edit3 className="w-3 h-3 text-yellow-400" />
                        <span>Editar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="py-12 text-center space-y-2 bg-zinc-950 rounded-2xl border border-zinc-800">
                  <Package className="w-8 h-8 mx-auto text-zinc-600" />
                  <p className="text-sm font-bold text-white">Nenhum produto encontrado</p>
                  <p className="text-xs text-zinc-400">Tente buscar por outro termo ou categoria.</p>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: CONFIGURAÇÕES DA LOJA */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              
              {/* Store Status Box */}
              <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-white">Status da Operação</h4>
                    <p className="text-xs text-zinc-400">Controle se a hamburgueria está aceitando pedidos agora</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateStoreSettings({ isOpen: !storeSettings.isOpen })}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <span className={`text-xs font-black ${storeSettings.isOpen ? 'text-emerald-400' : 'text-red-400'}`}>
                      {storeSettings.isOpen ? 'ABERTO' : 'FECHADO'}
                    </span>
                    {storeSettings.isOpen ? (
                      <ToggleRight className="w-9 h-9 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 text-zinc-600" />
                    )}
                  </button>
                </div>

                {!storeSettings.isOpen && (
                  <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-xs text-red-300">
                    Aviso: O cardápio está em modo visualização. Os clientes são avisados que a loja está fechada e não conseguem concluir pedidos até a reabertura.
                  </div>
                )}
              </div>

              {/* Announcement Banner */}
              <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4">
                <h4 className="text-sm font-black text-white">Faixa de Aviso no Topo do Cardápio</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">
                      Mensagem de Aviso (Deixe em branco para ocultar)
                    </label>
                    <input
                      type="text"
                      value={storeSettings.activeBannerAnnouncement || ''}
                      onChange={e => updateStoreSettings({ activeBannerAnnouncement: e.target.value })}
                      placeholder="Ex: Chopp Artesanal em dobro hoje até às 21h! Aproveite!"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>
              </div>

              {/* PIX Key and Preparation Time */}
              <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4">
                <h4 className="text-sm font-black text-white">Chave PIX Oficial & Tempo de Preparo</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">Chave PIX</label>
                    <input
                      type="text"
                      value={storeSettings.pixKey || ''}
                      onChange={e => updateStoreSettings({ pixKey: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">Nome do Titular do PIX</label>
                    <input
                      type="text"
                      value={storeSettings.pixReceiverName || ''}
                      onChange={e => updateStoreSettings({ pixReceiverName: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">Tempo Mínimo de Preparo (min)</label>
                    <input
                      type="number"
                      value={storeSettings.estimatedPrepTimeMin || 30}
                      onChange={e => updateStoreSettings({ estimatedPrepTimeMin: Number(e.target.value) })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">Tempo Máximo de Preparo (min)</label>
                    <input
                      type="number"
                      value={storeSettings.estimatedPrepTimeMax || 45}
                      onChange={e => updateStoreSettings({ estimatedPrepTimeMax: Number(e.target.value) })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>
              </div>

              {/* Security & Access PIN */}
              <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-yellow-400" />
                  <h4 className="text-sm font-black text-white">Segurança do Painel do Gerente</h4>
                </div>
                <form onSubmit={handleSaveSecurity} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-400 block mb-1">PIN Rápido (4 Dígitos)</label>
                      <input
                        type="text"
                        value={customPinInput}
                        onChange={e => setCustomPinInput(e.target.value)}
                        placeholder="1234"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-400 block mb-1">Senha Master</label>
                      <input
                        type="text"
                        value={customPassInput}
                        onChange={e => setCustomPassInput(e.target.value)}
                        placeholder="popidi@2026"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow"
                    >
                      Salvar Nova Senha / PIN
                    </button>
                    {pinSavedFeedback && (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                        <Check className="w-3.5 h-3.5" />
                        <span>Credenciais atualizadas com sucesso!</span>
                      </span>
                    )}
                  </div>
                </form>
              </div>

            </div>
          )}

        </div>

        {/* Bottom Footer */}
        <div className="p-3.5 sm:p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs shrink-0">
          <div className="text-zinc-500">
            PO-PI-DI Hamburgueria & Choperia • Painel do Gerente
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMenuEditorOpen(true)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Editar Cardápio e Informações</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAdminOpen(false)}
              className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl font-bold transition-colors cursor-pointer border border-zinc-800"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
