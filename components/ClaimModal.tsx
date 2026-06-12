'use client';

import { useState, FormEvent } from 'react';
import { Gift } from '@/lib/types';
import Image from 'next/image';

interface ClaimModalProps {
  gift: Gift;
  isOpen: boolean;
  onClose: () => void;
  onClaim: (giftId: string, nome: string) => Promise<void>;
}

export default function ClaimModal({ gift, isOpen, onClose, onClaim }: ClaimModalProps) {
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onClaim(gift.id, nome);
      setNome('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-scale-in">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Presentear
        </h2>

        {/* Gift Image */}
        {gift.imagemUrl && (
          <div className="mb-4 relative h-48 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={gift.imagemUrl}
              alt={gift.nome}
              fill
              className="object-cover"
              sizes="400px"
            />
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-700 font-medium mb-1">{gift.nome}</p>
          <p className="text-gray-500 text-sm">{gift.descricao}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Seu Nome
            </label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
              placeholder="Digite seu nome"
              required
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition disabled:opacity-50"
            >
              Mudei de ideia
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-[#73a66c] text-white rounded-full hover:bg-[#628f5c] transition disabled:opacity-50"
            >
              {loading ? 'Presenteando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
