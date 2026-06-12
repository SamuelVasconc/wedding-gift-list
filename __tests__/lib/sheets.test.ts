/**
 * Note: These tests are basic examples. For full testing of the Google Sheets integration,
 * you would need to mock the googleapis library or use integration tests with a test sheet.
 */

import { Gift } from '@/lib/types';

describe('Google Sheets Integration', () => {
  it('should define Gift type correctly', () => {
    const gift: Gift = {
      id: '1',
      nome: 'Test Gift',
      descricao: 'Test description',
      imagemUrl: 'https://example.com/test.jpg',
      status: 'disponivel',
      reservadoPor: '',
    };

    expect(gift.id).toBe('1');
    expect(gift.status).toBe('disponivel');
  });

  it('should accept reserved status', () => {
    const gift: Gift = {
      id: '2',
      nome: 'Reserved Gift',
      descricao: 'Test description',
      imagemUrl: 'https://example.com/test.jpg',
      status: 'reservado',
      reservadoPor: 'John Doe',
    };

    expect(gift.status).toBe('reservado');
    expect(gift.reservadoPor).toBe('John Doe');
  });
});
