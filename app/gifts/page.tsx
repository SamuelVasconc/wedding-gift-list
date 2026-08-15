'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Gift } from '@/lib/types';
import GiftCard from '@/components/GiftCard';
import ClaimModal from '@/components/ClaimModal';
import Toast from '@/components/Toast';
import PixCard from '@/components/PixCard';

export default function GiftsPage() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(true);
  const lastScrollY = useRef(0);
  const router = useRouter();

  useEffect(() => {
    fetchGifts();
  }, []);

  // Esconde a busca ao rolar para baixo e mostra de volta ao rolar para cima.
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (currentY < 80) {
        setShowSearch(true);
      } else if (delta > 8) {
        setShowSearch(false);
      } else if (delta < -8) {
        setShowSearch(true);
      }

      // Só atualiza a referência quando o movimento passa do limiar,
      // senão roladas muito lentas nunca acumulam delta suficiente.
      if (Math.abs(delta) > 8) {
        lastScrollY.current = currentY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchGifts = async () => {
    try {
      const response = await fetch('/api/gifts');

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch gifts');
      }

      const data = await response.json();
      setGifts(data);
    } catch (error) {
      console.error('Error fetching gifts:', error);
      setToast({ message: 'Erro ao carregar presentes', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = (gift: Gift) => {
    setSelectedGift(gift);
  };

  const handleClaim = async (giftId: string, nome: string) => {
    try {
      const response = await fetch(`/api/gifts/${giftId}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome }),
      });

      const data = await response.json();

      if (!response.ok) {
        setToast({ message: data.error || 'Erro ao presentear', type: 'error' });
        setSelectedGift(null);
        await fetchGifts();
        return;
      }

      setToast({ message: 'Reservado! Muito obrigado pelo presente!', type: 'success' });
      setSelectedGift(null);
      await fetchGifts();
    } catch (error) {
      console.error('Error claiming gift:', error);
      setToast({ message: 'Erro ao presentear', type: 'error' });
      setSelectedGift(null);
    }
  };

  const whatsappNumbers = process.env.NEXT_PUBLIC_WHATSAPP_NUMBERS?.split(',') || [];

  // Filter gifts based on search term
  const filteredGifts = gifts.filter((gift) =>
    gift.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col gifts-background">
      <header className="bg-cream shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-normal text-gray-800 mb-1 font-alex-brush">
              Maíra e Samuel
            </h1>
            <p className="text-2xl sm:text-3xl text-gray-700 mb-2 font-alex-brush">
              03/04/27
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 font-playfair">
              Lista de Presentes
            </h2>
          </div>
        </div>
      </header>

      {/* Search Bar — fixa no topo, some ao rolar para baixo */}
      {!loading && gifts.length > 0 && (
        <div
          className={`sticky top-0 z-30 border-y border-gray-200 bg-cream/95 backdrop-blur-sm shadow-sm transition-transform duration-300 ${
            showSearch ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar presente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 sm:py-2.5 border border-gray-300 rounded-full text-sm sm:text-base focus:ring-2 focus:ring-[#73a66c] focus:border-transparent outline-none transition text-gray-900 placeholder-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8 pb-[calc(4.5rem+env(safe-area-inset-bottom))] sm:pb-[calc(3.5rem+env(safe-area-inset-bottom))] w-full">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block w-16 h-16 border-4 border-gray-300 border-t-[#73a66c] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 text-lg">Carregando presentes...</p>
            </div>
          </div>
        ) : (
          <>
            {/* PIX Card */}
            <div className="animate-fade-up">
              <PixCard />
            </div>

            {/* Gifts Grid */}
            {gifts.length === 0 ? (
              <div className="text-center py-12 animate-fade-up">
                <p className="text-gray-600 text-lg">Nenhum presente disponível</p>
              </div>
            ) : filteredGifts.length === 0 ? (
              <div className="text-center py-12 animate-fade-up">
                <p className="text-gray-600 text-lg mb-2">Nenhum presente encontrado para "{searchTerm}"</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-[#73a66c] hover:text-[#628f5c] font-medium text-sm"
                >
                  Limpar busca
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 sm:gap-8 animate-fade-up">
                {filteredGifts.map((gift, index) => (
                  <div
                    key={gift.id}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    className="animate-fade-up"
                  >
                    <GiftCard
                      gift={gift}
                      onReserve={handleReserve}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="fixed bottom-0 inset-x-0 z-40 bg-cream/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2 pb-[calc(0.375rem+env(safe-area-inset-bottom))] sm:pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center leading-tight">
            <p className="text-gray-600 text-[11px] sm:text-xs">
              <span className="hidden sm:inline">Reservou errado? Tendo algum problema com o site? Fale diretamente conosco:</span>
              <span className="sm:hidden">Problemas? Fale conosco:</span>
            </p>
            {whatsappNumbers.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-x-2">
                {whatsappNumbers.map((number, index) => (
                  <a
                    key={index}
                    href={`https://wa.me/${number.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition text-[11px] sm:text-xs font-medium"
                  >
                    {number.trim()}
                  </a>
                ))}
              </div>
            )}
            <span className="hidden sm:inline text-gray-300 text-xs">•</span>
            <p className="text-gray-400 text-[10px] sm:text-xs w-full sm:w-auto">
              Criado por:{' '}
              <a
                href="https://github.com/samuelvasconc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 transition"
              >
                Samuel Vasconcelos
              </a>
            </p>
          </div>
        </div>
      </footer>

      <ClaimModal
        gift={selectedGift!}
        isOpen={selectedGift !== null}
        onClose={() => setSelectedGift(null)}
        onClaim={handleClaim}
      />

      <Toast
        message={toast?.message || ''}
        type={toast?.type || 'success'}
        isOpen={toast !== null}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
