'use client';

import { Gift } from '@/lib/types';
import Image from 'next/image';

interface GiftCardProps {
  gift: Gift;
  onReserve: (gift: Gift) => void;
}

export default function GiftCard({ gift, onReserve }: GiftCardProps) {
  const isReserved = gift.status === 'reservado';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-28 sm:h-44 bg-gray-100">
        {gift.imagemUrl ? (
          <Image
            src={gift.imagemUrl}
            alt={gift.nome}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 33vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg
              className="w-8 h-8 sm:w-16 sm:h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-1.5 sm:p-3">
        <h3 className="text-xs sm:text-base font-semibold text-gray-800 mb-1 sm:mb-2 line-clamp-2">
          {gift.nome}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 hidden sm:block">
          {gift.descricao}
        </p>

        <button
          onClick={() => onReserve(gift)}
          disabled={isReserved}
          className={`w-full py-1 sm:py-1.5 px-1.5 sm:px-3 rounded-full text-xs sm:text-sm font-medium transition ${
            isReserved
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#73a66c] text-white hover:bg-[#628f5c]'
          }`}
        >
          {isReserved ? 'Reservado' : 'Presentear'}
        </button>
      </div>
    </div>
  );
}
