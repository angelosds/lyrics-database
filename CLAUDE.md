# Lyrics Database

Aplicação web para centralizar e compartilhar letras de músicas de uma banda, com área pública de consulta e área administrativa para gerenciamento.

## Visão Geral

**Problema:** Letras de músicas de uma banda espalhadas, sem um local único e acessível publicamente para consulta e compartilhamento.

**Solução:** Uma plataforma web onde qualquer pessoa pode acessar e compartilhar letras, e membros autorizados da banda podem gerenciar o conteúdo e criar setlists para shows.

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 15 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS |
| Banco de Dados | Neon (PostgreSQL serverless) |
| ORM | Drizzle ORM |
| Autenticação | NextAuth.js v5 |
| Hospedagem | Vercel |

## Funcionalidades

### Área Pública (sem login)
- Listagem de todas as músicas da banda
- Busca por título, trecho de letra ou álbum
- Visualização completa da letra de cada música
- URL amigável e compartilhável por música (ex: `/musicas/nome-da-musica`)
- Metadados por música: título, álbum, ano, tom (key)

### Área Administrativa (requer login)
- Login via credenciais (usuário + senha)
- Gerenciar músicas: criar, editar, arquivar
- Editor de letras com suporte a formatação básica (versos, refrões, pontes)
- Gerenciar setlists:
  - Criar setlist para um evento (nome, data, local)
  - Adicionar/remover/reordenar músicas
  - Visualizar e imprimir setlist
  - Compartilhar setlist publicamente via link

## Modelo de Dados

```sql
-- Músicas
songs (
  id          uuid primary key,
  title       text not null,
  slug        text unique not null,
  lyrics      text not null,
  album       text,
  year        integer,
  key         text,          -- tom musical (ex: "C", "Am")
  bpm         integer,
  notes       text,          -- notas internas
  archived    boolean default false,
  created_at  timestamp,
  updated_at  timestamp
)

-- Setlists
setlists (
  id          uuid primary key,
  name        text not null,
  event_date  date,
  venue       text,
  public_slug text unique,   -- para compartilhamento público
  created_at  timestamp,
  updated_at  timestamp
)

-- Músicas em um setlist (ordem importa)
setlist_songs (
  id          uuid primary key,
  setlist_id  uuid references setlists(id),
  song_id     uuid references songs(id),
  position    integer not null,
  notes       text   -- notas específicas para aquele show
)

-- Usuários administrativos
users (
  id            uuid primary key,
  email         text unique not null,
  password_hash text not null,
  name          text,
  created_at    timestamp
)
```

## Estrutura do Projeto

```
lyrics-database/
├── src/
│   ├── app/
│   │   ├── (public)/           # rotas públicas
│   │   │   ├── page.tsx        # listagem de músicas
│   │   │   ├── musicas/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx  # letra da música
│   │   │   └── setlists/
│   │   │       └── [slug]/
│   │   │           └── page.tsx  # setlist público
│   │   ├── (admin)/            # rotas protegidas
│   │   │   ├── layout.tsx      # verifica autenticação
│   │   │   ├── dashboard/
│   │   │   ├── musicas/
│   │   │   │   ├── page.tsx    # lista para edição
│   │   │   │   ├── nova/
│   │   │   │   └── [id]/editar/
│   │   │   └── setlists/
│   │   │       ├── page.tsx
│   │   │       ├── novo/
│   │   │       └── [id]/editar/
│   │   ├── api/
│   │   │   └── auth/[...nextauth]/
│   │   └── layout.tsx
│   ├── db/
│   │   ├── schema.ts           # schema Drizzle
│   │   └── index.ts            # conexão Neon
│   ├── lib/
│   │   ├── auth.ts             # config NextAuth
│   │   └── utils.ts
│   └── components/
│       ├── ui/                 # componentes base
│       ├── song-card.tsx
│       ├── lyrics-display.tsx
│       └── setlist-view.tsx
├── drizzle/
│   └── migrations/
├── drizzle.config.ts
├── .env.local                  # vars locais (não commitar)
└── .env.example                # template de variáveis
```

## Variáveis de Ambiente

```env
# Banco de Dados (Neon)
DATABASE_URL=postgres://...

# NextAuth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# (produção - Vercel define automaticamente)
# NEXTAUTH_URL=https://seu-dominio.vercel.app
```

## Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar localmente
npm run dev

# Gerar e aplicar migrations do banco
npm run db:generate
npm run db:migrate

# Abrir Drizzle Studio (UI do banco)
npm run db:studio

# Build de produção
npm run build
```

## Ordem de Implementação

1. [ ] Inicializar projeto Next.js com TypeScript e Tailwind
2. [ ] Configurar Neon + Drizzle ORM + schema inicial
3. [ ] Migrations e seed de dados de exemplo
4. [ ] Páginas públicas: listagem e visualização de letras
5. [ ] Configurar NextAuth com login por credenciais
6. [ ] Área admin: CRUD de músicas
7. [ ] Área admin: CRUD de setlists com ordenação de músicas
8. [ ] Página pública de setlist compartilhável
9. [ ] Busca de músicas
10. [ ] Deploy no Vercel + configuração de variáveis de ambiente

## Convenções

- Slug das músicas gerado automaticamente a partir do título (slugify)
- Letras armazenadas como texto plano, com `\n` separando linhas e linha em branco separando estrofes
- Formatação visual das letras feita no frontend
- Todas as rotas admin protegidas por middleware Next.js
- Sem registro público — usuários criados manualmente no banco ou via script seed
