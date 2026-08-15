'use client';

import Image from 'next/image';

export default function PixCard() {
  return (
    <div className="bg-cream rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Text content */}
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm sm:text-base text-gray-700 mb-2">
            Sinta-se à vontade caso queira nos dar um presente fora da lista!
          </p>
          <p className="text-sm sm:text-base text-gray-700 font-semibold">
            Sinta-se ainda mais à vontade para nos dar dinheiro!!! Este é nosso pix:
          </p>
        </div>

        {/* QR Code */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-lg overflow-hidden border-2 border-gray-300 flex items-center justify-center p-2">
            <Image
              src="/QRcode.jpeg"
              alt="QR Code PIX"
              width={160}
              height={160}
              className="object-contain w-full h-full"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
