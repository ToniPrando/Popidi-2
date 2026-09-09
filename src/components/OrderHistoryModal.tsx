import React, { useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatBRL, formatDateTime, getPaymentMethodLabel } from '../utils/formatters';
import { 
  X, 
  History, 
  RotateCcw, 
  ShoppingBag, 
  ChevronRight, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Flame,
  Search,
  Cloud,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Order } from '../types';

export const OrderHistoryModal: React.FC = () => {
  const { 
    orders, 
    customerInfo,
    isOrderHistoryOpen, 
    setIsOrderHistoryOpen, 
    reorder, 
    setActiveOrder, 
    setIsOrderTrackerOpen,
    searchAndTrackOrder
  } = useCart();

  const { user, profile } = useAuth();
  const [searchCodeInput, setSearchCodeInput] = useState('');
  const [searchStatus, setSearchStatus] = useState<{ loading: boolean; error?: string; success?: string }>({ loading: false });

  // Filter orders for the logged-in user, profile or current browser session
  const userOrders = useMemo(() => {
    try {
      const allOrders = Array.isArray(orders) ? orders.filter(Boolean) : [];

      let localPlacedIds: string[] = [];
      try {
        const stored = localStorage.getItem('popidi_placed_order_ids');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            localPlacedIds = parsed.map(id => String(id || '').trim()).filter(Boolean);
          } else if (typeof parsed === 'string' && parsed.trim()) {
            localPlacedIds = [parsed.trim()];
          }
        }
      } catch {
        localPlacedIds = [];
      }

      // If user is not logged in, show orders placed in this browser or matching current session phone
      const targetEmail = String(user?.email || profile?.email || customerInfo?.email || '').toLowerCase().trim();
      const targetUid = String(user?.uid || profile?.uid || '').trim();
      const targetPhone = String(profile?.phone || customerInfo?.phone || '').replace(/\D/g, '');
      const targetName = String(profile?.name || user?.displayName || customerInfo?.name || '').toLowerCase().trim();

      const isLoggedIn = Boolean(user || profile);

      return allOrders.filter(order => {
        if (!order || typeof order !== 'object') return false;

        const orderId = String(order.id || '').trim();

        // 1. Check if placed in this session/browser
        if (orderId && Array.isArray(localPlacedIds) && localPlacedIds.includes(orderId)) {
          return true;
        }

        // 2. Match by UID if logged in
        if (targetUid && order.userId && String(order.userId).trim() === targetUid) {
          return true;
        }

        // 3. Match by Email
        const rawEmail = order.userEmail || order.customerEmail || (typeof order.customer === 'object' && order.customer ? order.customer.email : '') || '';
        const email = String(rawEmail).toLowerCase().trim();
        if (targetEmail && email && email === targetEmail) {
          return true;
        }

        // 4. Match by Phone (exact or suffix match)
        const rawPhone = order.customerPhone || (typeof order.customer === 'object' && order.customer ? order.customer.phone : '') || '';
        const phone = String(rawPhone).replace(/\D/g, '');
        if (targetPhone && phone) {
          const cleanTarget = targetPhone.slice(-8);
          const cleanPhone = phone.slice(-8);
          if (cleanTarget.length >= 8 && cleanPhone.length >= 8 && cleanTarget === cleanPhone) {
            return true;
          }
          if (phone === targetPhone || phone.endsWith(targetPhone) || targetPhone.endsWith(phone)) {
            return true;
          }
        }

        // 5. If logged in and customer name matches identically
        if (isLoggedIn && targetName && targetName.length >= 3) {
          const rawCustomerName = (typeof order.customer === 'object' && order.customer ? order.customer.name : '') || (order as any).customerName || '';
          const orderCustomerName = String(rawCustomerName).toLowerCase().trim();
          if (orderCustomerName && orderCustomerName === targetName) {
            return true;
          }
        }

        return false;
      });
    } catch (e) {
      console.error('Error filtering user orders:', e);
      return [];
    }
  }, [orders, user, profile, customerInfo]);

  if (!isOrderHistoryOpen) return null;

  const handleTrackOrder = (order: Order) => {
    setActiveOrder(order);
    setIsOrderHistoryOpen(false);
    setIsOrderTrackerOpen(true);
  };

  const handleSearchOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchCodeInput.trim()) return;

    setSearchStatus({ loading: true });
    const res = await searchAndTrackOrder(searchCodeInput);
    if (res.success) {
      setSearchStatus({ loading: false, success: res.message });
      setIsOrderHistoryOpen(false);
    } else {
      setSearchStatus({ loading: false, error: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative bg-zinc-950 border border-zinc-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col text-left max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Meus Pedidos & Rastreamento
                </h3>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Cloud className="w-2.5 h-2.5" />
                  Nuvem Ativa
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Sincronizado em tempo real entre todos os seus dispositivos
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOrderHistoryOpen(false)}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders list */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Quick Order Lookup by Code or Phone */}
          <form onSubmit={handleSearchOrder} className="p-3.5 bg-zinc-900/90 rounded-2xl border border-zinc-800/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-amber-400" />
                Rastrear Pedido de Outro Dispositivo:
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchCodeInput}
                onChange={e => setSearchCodeInput(e.target.value)}
                placeholder="Ex: #PO-4821 ou seu Telefone WhatsApp"
                className="flex-1 bg-zinc-950 border border-zinc-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={searchStatus.loading || !searchCodeInput.trim()}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 text-black disabled:text-zinc-500 font-black text-xs rounded-xl shadow transition-colors flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
              >
                {searchStatus.loading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Buscar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
            {searchStatus.error && (
              <p className="text-[11px] text-red-400 font-medium">{searchStatus.error}</p>
            )}
            {searchStatus.success && (
              <p className="text-[11px] text-emerald-400 font-medium">{searchStatus.success}</p>
            )}
          </form>

          {userOrders.length === 0 ? (
            <div className="py-10 text-center space-y-3 px-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/80">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-amber-400">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h4 className="text-sm font-bold text-white">Nenhum pedido recente salvo neste aparelho</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Digite seu telefone ou o código de acompanhamento (#PO-XXXX) no campo de busca acima para localizar seu pedido imediatamente.
                </p>
              </div>
            </div>
          ) : (
            userOrders.map((order, orderIdx) => {
              if (!order || typeof order !== 'object') return null;

              const safeItems = Array.isArray(order.items) ? order.items.filter(Boolean) : [];
              const safeTotal = typeof order.total === 'number' && !isNaN(order.total) ? order.total : Number(order.total) || 0;
              const safeShortCode = order.shortCode || `#PO-${String(order.id || orderIdx).slice(-4).toUpperCase()}`;
              const orderStatus = order.status || 'received';

              return (
                <div
                  key={order.id || `order-${orderIdx}`}
                  className="p-4 bg-zinc-900/70 hover:bg-zinc-900 rounded-xl border border-zinc-800 space-y-3 transition-colors text-left"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                    <div>
                      <span className="font-mono text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 mr-2">
                        {safeShortCode}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {formatDateTime(order.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        orderStatus === 'completed'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : orderStatus === 'preparing'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : orderStatus === 'out_for_delivery'
                          ? 'bg-purple-950 text-purple-400 border border-purple-800'
                          : orderStatus === 'ready'
                          ? 'bg-teal-950 text-teal-400 border border-teal-800'
                          : orderStatus === 'cancelled'
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : 'bg-blue-950 text-blue-400 border border-blue-800'
                      }`}>
                        {orderStatus === 'received' && 'Recebido'}
                        {orderStatus === 'preparing' && 'Na Chapa'}
                        {orderStatus === 'out_for_delivery' && 'Em Entrega'}
                        {orderStatus === 'ready' && 'Pronto'}
                        {orderStatus === 'completed' && 'Entregue'}
                        {orderStatus === 'cancelled' && 'Cancelado'}
                        {!['received', 'preparing', 'out_for_delivery', 'ready', 'completed', 'cancelled'].includes(orderStatus) && 'Processando'}
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-zinc-300 space-y-1">
                    {safeItems.map((it, idx) => {
                      const itemName = it?.menuItem?.name || (it as any)?.name || 'Item do Pedido';
                      const itemQuantity = Number(it?.quantity) || 1;
                      const itemPrice = typeof it?.totalPrice === 'number' ? it.totalPrice : (Number(it?.unitPrice) || 0) * itemQuantity;
                      return (
                        <div key={it?.cartItemId || (it as any)?.id || `item-${idx}`} className="flex justify-between">
                          <span className="text-zinc-200">
                            {itemQuantity}x {itemName}
                          </span>
                          <span className="text-zinc-400 font-medium">
                            {formatBRL(itemPrice)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total & Action buttons */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/80">
                    <div>
                      <span className="text-[11px] text-zinc-400 block">Total do Pedido:</span>
                      <span className="text-sm font-black text-amber-400">{formatBRL(safeTotal)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleTrackOrder(order)}
                        className="flex items-center gap-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-700 font-medium transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>Rastrear</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => reorder(order)}
                        className="flex items-center gap-1 text-xs bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 rounded-lg font-black transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Pedir Novamente</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex justify-end">
          <button
            onClick={() => setIsOrderHistoryOpen(false)}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs px-4 py-2.5 rounded-xl border border-zinc-800 transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};

