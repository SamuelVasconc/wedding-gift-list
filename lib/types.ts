export interface Gift {
  id: string;
  nome: string;
  descricao: string;
  imagemUrl: string;
  status: 'disponivel' | 'reservado';
  reservadoPor: string;
}

export interface ClaimGiftRequest {
  nome: string;
}
