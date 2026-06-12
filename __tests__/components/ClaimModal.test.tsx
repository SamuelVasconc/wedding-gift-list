import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ClaimModal from '@/components/ClaimModal';
import { Gift } from '@/lib/types';

const mockGift: Gift = {
  id: '1',
  nome: 'Jogo de Panelas',
  descricao: 'Conjunto completo de panelas antiaderentes',
  imagemUrl: 'https://example.com/panelas.jpg',
  status: 'disponivel',
  reservadoPor: '',
};

describe('ClaimModal', () => {
  it('does not render when closed', () => {
    const onClose = jest.fn();
    const onClaim = jest.fn();

    render(
      <ClaimModal
        gift={mockGift}
        isOpen={false}
        onClose={onClose}
        onClaim={onClaim}
      />
    );

    expect(screen.queryByText('Reservar Presente')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    const onClose = jest.fn();
    const onClaim = jest.fn();

    render(
      <ClaimModal
        gift={mockGift}
        isOpen={true}
        onClose={onClose}
        onClaim={onClaim}
      />
    );

    expect(screen.getByText('Reservar Presente')).toBeInTheDocument();
    expect(screen.getByText('Jogo de Panelas')).toBeInTheDocument();
  });

  it('calls onClose when clicking "Mudei de ideia"', () => {
    const onClose = jest.fn();
    const onClaim = jest.fn();

    render(
      <ClaimModal
        gift={mockGift}
        isOpen={true}
        onClose={onClose}
        onClaim={onClaim}
      />
    );

    const cancelButton = screen.getByRole('button', { name: 'Mudei de ideia' });
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClaim with gift id and name when submitting', async () => {
    const onClose = jest.fn();
    const onClaim = jest.fn().mockResolvedValue(undefined);

    render(
      <ClaimModal
        gift={mockGift}
        isOpen={true}
        onClose={onClose}
        onClaim={onClaim}
      />
    );

    const input = screen.getByLabelText('Seu Nome');
    const submitButton = screen.getByRole('button', { name: 'Confirmar' });

    fireEvent.change(input, { target: { value: 'Maria Silva' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onClaim).toHaveBeenCalledWith('1', 'Maria Silva');
    });
  });

  it('requires name input before submitting', () => {
    const onClose = jest.fn();
    const onClaim = jest.fn();

    render(
      <ClaimModal
        gift={mockGift}
        isOpen={true}
        onClose={onClose}
        onClaim={onClaim}
      />
    );

    const input = screen.getByLabelText('Seu Nome');
    expect(input).toBeRequired();
  });
});
