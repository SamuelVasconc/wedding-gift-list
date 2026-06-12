# Template da Planilha Google Sheets

## Nome da Aba
`Presentes`

## Estrutura das Colunas

| Coluna | Nome | Tipo | Descrição | Valores Possíveis |
|--------|------|------|-----------|-------------------|
| A | ID | Texto/Número | Identificador único do presente | 1, 2, 3... ou texto único |
| B | Nome | Texto | Nome do presente | Jogo de Panelas, Liquidificador, etc. |
| C | Descrição | Texto | Descrição detalhada do presente | Texto livre |
| D | Imagem URL | URL | Link para imagem do presente | URLs https:// válidas |
| E | Status | Texto | Status da reserva | `disponivel` ou `reservado` |
| F | Reservado Por | Texto | Nome de quem reservou | Vazio se disponível, nome se reservado |

## Exemplo de Planilha

Copie e cole este exemplo no Google Sheets:

```
ID	Nome	Descrição	Imagem URL	Status	Reservado Por
1	Jogo de Panelas	Conjunto completo com 5 panelas antiaderentes de alta qualidade	https://images.unsplash.com/photo-1556909114-f6e7ad7d3136	disponivel	
2	Liquidificador	Liquidificador potente 1000W com 12 velocidades e jarra de vidro	https://images.unsplash.com/photo-1570222094114-d054a817e56b	disponivel	
3	Jogo de Toalhas	Conjunto premium com 6 toalhas de banho 100% algodão	https://images.unsplash.com/photo-1616627781431-23b776aad0f2	disponivel	
4	Cafeteira	Cafeteira elétrica programável para 12 xícaras	https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6	disponivel	
5	Aspirador de Pó	Aspirador de pó robô com mapeamento inteligente	https://images.unsplash.com/photo-1558317374-067fb5f30001	disponivel	
6	Mixer	Mixer profissional com 5 velocidades e batedores	https://images.unsplash.com/photo-1578916171728-46686eac8d58	disponivel	
7	Micro-ondas	Micro-ondas 30L com grill e 10 programas automáticos	https://images.unsplash.com/photo-1585659722983-3a675dabf23d	disponivel	
8	Ferro de Passar	Ferro a vapor profissional com base antiaderente	https://images.unsplash.com/photo-1574269909862-7e1d70bb8078	disponivel	
9	Aparelho de Jantar	Aparelho de jantar 42 peças em porcelana branca	https://images.unsplash.com/photo-1578500494198-246f612d3b3d	disponivel	
10	Processador de Alimentos	Processador multifuncional com 11 acessórios	https://images.unsplash.com/photo-1595252260629-eb70a13c6260	disponivel	
```

## Instruções de Uso

### 1. Criar Nova Linha (Adicionar Presente)

1. Vá para a próxima linha vazia
2. Preencha:
   - **ID**: Próximo número sequencial (ex: se o último é 10, use 11)
   - **Nome**: Nome curto do presente
   - **Descrição**: Descrição detalhada
   - **Imagem URL**: URL completa de uma imagem (ex: https://...)
   - **Status**: Sempre inicie com `disponivel`
   - **Reservado Por**: Deixe vazio

### 2. Editar Presente Existente

1. Localize a linha do presente
2. Edite as colunas Nome, Descrição ou Imagem URL
3. **NÃO edite** manualmente Status ou Reservado Por (o sistema gerencia automaticamente)

### 3. Remover Presente

1. Localize a linha do presente
2. Delete a linha inteira
3. **Cuidado:** Não delete a linha de cabeçalho (linha 1)

### 4. Resetar Reserva (Apenas se necessário)

Se precisar "liberar" um presente que foi reservado por engano:

1. Localize a linha do presente
2. Altere coluna **Status** para `disponivel`
3. Limpe o conteúdo da coluna **Reservado Por**

## Dicas de URLs de Imagens

Você pode usar imagens de:

### Unsplash (gratuito)
- Acesse: https://unsplash.com
- Busque pela imagem desejada
- Clique com botão direito > "Copiar endereço da imagem"

### Google Images
- Busque a imagem no Google
- Clique na imagem
- Clique com botão direito > "Copiar endereço da imagem"

### Lojas Online
- Acesse sites como Amazon, Magazine Luiza, etc.
- Clique na imagem do produto
- Clique com botão direito > "Copiar endereço da imagem"

**Importante:** Sempre use URLs que comecem com `https://`

## Validações Importantes

### ✅ Correto
```
Status: disponivel
Status: reservado
```

### ❌ Incorreto
```
Status: Disponivel (com letra maiúscula)
Status: disponível (com acento)
Status: available (em inglês)
Status: livre
```

### IDs Únicos
Cada presente deve ter um ID único. Exemplos válidos:
- `1`, `2`, `3`
- `presente-1`, `presente-2`
- `panelas`, `liquidificador`

**NÃO repita IDs!**

## Exemplo Completo de Presente

```
ID: 15
Nome: Conjunto de Facas
Descrição: Kit profissional com 8 facas em aço inoxidável, suporte em madeira e afiador incluído
Imagem URL: https://images.unsplash.com/photo-1593618998160-e34014e67546
Status: disponivel
Reservado Por: (vazio)
```

Quando alguém reservar, o sistema automaticamente mudará para:

```
ID: 15
Nome: Conjunto de Facas
Descrição: Kit profissional com 8 facas em aço inoxidável, suporte em madeira e afiador incluído
Imagem URL: https://images.unsplash.com/photo-1593618998160-e34014e67546
Status: reservado
Reservado Por: João Silva
```

## Permissões da Planilha

### Quem pode editar:
- Você (proprietário da planilha)
- A service account do Google Cloud (email parecido com: `wedding-gift-list@project-id.iam.gserviceaccount.com`)

### Quem NÃO pode editar:
- Visitantes do site (eles apenas visualizam através da API)
- Outras pessoas (a menos que você compartilhe explicitamente)

## Solução de Problemas

### Presentes não aparecem no site
- Verifique se a aba se chama exatamente "Presentes"
- Confirme que a linha 1 contém os cabeçalhos
- Verifique se o Status está escrito como `disponivel` (sem acento)

### Imagens não carregam
- Confirme que a URL começa com `https://`
- Teste a URL colando diretamente no navegador
- Use imagens de domínios públicos (evite imagens privadas do Google Drive que exigem login)

### Status não atualiza
- Verifique se a service account tem permissão de "Editor" na planilha
- Não edite manualmente Status/Reservado Por enquanto o site está rodando
