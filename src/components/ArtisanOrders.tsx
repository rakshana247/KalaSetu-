import React from 'react';
import { DemoOrder } from '../types/catalogue.ts';
import { ShoppingBag, Truck, CheckCircle2, Clock, MapPin, Info } from 'lucide-react';

interface ArtisanOrdersProps {
  orders: DemoOrder[];
}

export const ArtisanOrders: React.FC<ArtisanOrdersProps> = ({ orders }) => {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#123F32] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#24664D]/40">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">📦</span>
          <span className="text-xs font-semibold bg-[#24664D] text-amber-200 border border-amber-300/30 px-3 py-1 rounded-full uppercase tracking-wider">
            Artisan Orders & Logistics
          </span>
          <span className="text-xs bg-white/10 text-white/90 px-2.5 py-0.5 rounded-full border border-white/20">
            Demo Showcase
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-2 text-[#F8F5EF]">
          Direct Customer Fulfillment
        </h2>
        <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-2xl">
          Track wholesale dispatch and individual customer consignments. Payments are settled directly into the artisan collective's verified bank account upon dispatch verification.
        </p>
      </div>

      <div className="p-3 bg-white rounded-xl border border-[#E8E1D7] flex items-center justify-between text-xs text-[#6F716A]">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#C45D3A] shrink-0" />
          <span>Showing simulated dispatch records for hackathon presentation.</span>
        </div>
        <span className="font-semibold text-[#123F32]">{orders.length} Total Orders</span>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E1D7] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F5EF] text-[#6F716A] uppercase tracking-wider border-b border-[#E8E1D7]">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Customer & Destination</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Payout (₹)</th>
                <th className="py-3 px-4">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E1D7]">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#F8F5EF]/50 transition">
                  <td className="py-4 px-4 font-bold text-[#123F32]">
                    {ord.order_number}
                  </td>
                  <td className="py-4 px-4 font-medium text-[#242720]">
                    {ord.product_name}
                  </td>
                  <td className="py-4 px-4 text-[#6F716A]">
                    <div className="font-medium text-[#242720]">{ord.customer_name}</div>
                    <div className="flex items-center gap-1 text-[11px] text-[#C45D3A]">
                      <MapPin className="w-3 h-3" />
                      {ord.destination}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#6F716A]">{ord.date}</td>
                  <td className="py-4 px-4 font-bold text-[#123F32] font-serif text-sm">
                    ₹{ord.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : ord.status === 'In Transit'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      {ord.status === 'Delivered' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {ord.status === 'In Transit' && <Truck className="w-3 h-3 text-blue-600" />}
                      {ord.status === 'Processing' && <Clock className="w-3 h-3 text-amber-600" />}
                      <span>{ord.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
