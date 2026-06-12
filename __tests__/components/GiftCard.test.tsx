import { render, screen, fireEvent } from '@testing-library/react';
import GiftCard from '@/components/GiftCard';
import { Gift } from '@/lib/types';

const mockGift: Gift = {
  id: '1',
  nome: 'Jogo de Panelas',
  descricao: 'Conjunto completo de panelas antiaderentes',
  imagemUrl: 'https://example.com/panelas.jpg',
  status: 'disponivel',
  reservadoPor: '',
};

const mockReservedGift: Gift = {
  ...mockGift,
  id: '2',
  status: 'reservado',
  reservadoPor: 'João Silva',
};

describe('GiftCard', () => {
  it('renders gift information correctly', () => {
    const onReserve = jest.fn();
    render(<GiftCard gift={mockGift} onReserve={onReserve} />);

    expect(screen.getByText('Jogo de Panelas')).toBeInTheDocument();
    expect(screen.getByText('Conjunto completo de panelas antiaderentes')).toBeInTheDocument();
  });

  it('shows "Reservar" button for available gifts', () => {
    const onReserve = jest.fn();
    render(<GiftCard gift={mockGift} onReserve={onReserve} />);

    const button = screen.getByRole('button', { name: 'Reservar' });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('calls onReserve when clicking the reserve button', () => {
    const onReserve = jest.fn();
    render(<GiftCard gift={mockGift} onReserve={onReserve} />);

    const button = screen.getByRole('button', { name: 'Reservar' });
    fireEvent.click(button);

    expect(onReserve).toHaveBeenCalledWith(mockGift);
  });

  it('shows "Reservado" button for reserved gifts', () => {
    const onReserve = jest.fn();
    render(<GiftCard gift={mockReservedGift} onReserve={onReserve} />);

    const button = screen.getByRole('button', { name: 'Reservado' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('does not call onReserve when clicking disabled reserved button', () => {
    const onReserve = jest.fn();
    render(<GiftCard gift={mockReservedGift} onReserve={onReserve} />);

    const button = screen.getByRole('button', { name: 'Reservado' });
    fireEvent.click(button);

    expect(onReserve).not.toHaveBeenCalled();
  });
});
