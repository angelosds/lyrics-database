# Repositório de Letras

Plataforma web para centralizar e compartilhar letras de músicas de uma banda. Qualquer pessoa pode acessar e compartilhar letras; membros autorizados gerenciam o conteúdo e criam setlists para shows.

## Funcionalidades

**Área pública**
- Listagem e busca de músicas por título, álbum ou trecho da letra
- Visualização de letra com metadados (álbum, ano, tonalidade, BPM)
- URLs amigáveis e compartilháveis (`/musicas/nome-da-musica`)
- Setlists públicos acessíveis por link (`/setlists/nome-do-show`)

**Área administrativa**
- Login por e-mail e senha
- Criar, editar e arquivar músicas
- Editor de setlists com ordenação de músicas por drag-and-drop simples
- Opção de tornar cada setlist público via link

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS + DM Sans / JetBrains Mono |
| Banco de dados | Neon (PostgreSQL serverless) |
| ORM | Drizzle ORM |
| Autenticação | NextAuth.js v5 |
| Hospedagem | Vercel |

## Pré-requisitos

- Node.js 18+
- Conta no [Neon](https://neon.tech) (banco de dados)
- Conta no [Vercel](https://vercel.com) (hospedagem)

## Configuração local

**1. Clone e instale as dependências**

```bash
git clone <url-do-repositorio>
cd lyrics-database
npm install
```

**2. Configure as variáveis de ambiente**

```bash
cp .env.example .env.local
```

Edite `.env.local` com seus valores:

```env
DATABASE_URL=postgres://user:password@host/db?sslmode=require
AUTH_SECRET=sua-chave-secreta-aqui
AUTH_URL=http://localhost:3000
```

Para gerar o `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

**3. Crie as tabelas e popule o banco**

```bash
npm run db:generate   # gera os arquivos de migration
npm run db:migrate    # aplica as migrations no banco
npm run db:seed       # insere dados de exemplo
```

O seed cria um usuário admin (`admin@banda.com` / `admin123`) e três músicas de exemplo.

**4. Rode o servidor de desenvolvimento**

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (inclui `drizzle-kit push`) |
| `npm run start` | Servidor de produção |
| `npm run db:generate` | Gera arquivos de migration a partir do schema |
| `npm run db:migrate` | Aplica as migrations no banco |
| `npm run db:studio` | Abre o Drizzle Studio (UI do banco) |
| `npm run db:seed` | Insere dados de exemplo |

## Deploy no Vercel

1. Importe o repositório no [Vercel](https://vercel.com/new)
2. Adicione as variáveis de ambiente em **Settings → Environment Variables**:

   | Variável | Descrição |
   |----------|-----------|
   | `DATABASE_URL` | Connection string do Neon (com `?sslmode=require`) |
   | `AUTH_SECRET` | Chave secreta para sessões (`openssl rand -base64 32`) |
   | `AUTH_URL` | URL de produção (ex: `https://seu-projeto.vercel.app`) |

3. Faça o deploy — as tabelas são criadas automaticamente no primeiro build via `drizzle-kit push`

## Estrutura do projeto

```
src/
├── app/
│   ├── (public)/          # Rotas públicas (listagem, letras, setlists)
│   ├── (admin)/           # Rotas protegidas (/admin/*)
│   ├── api/auth/          # Handler do NextAuth
│   └── login/             # Página de login
├── components/            # Componentes reutilizáveis
├── db/
│   ├── schema.ts          # Schema Drizzle (songs, setlists, users)
│   ├── index.ts           # Conexão com o Neon
│   └── seed.ts            # Script de seed
└── lib/
    ├── auth.ts            # Configuração do NextAuth
    ├── utils.ts           # slugify e formatação de letras
    └── actions/           # Server Actions (songs, setlists)
```

## Convenções

- Slugs gerados automaticamente a partir do título (ex: `bondade-de-deus`)
- Letras em texto plano — estrofes separadas por linha em branco
- Usuários criados manualmente via seed ou Drizzle Studio (sem registro público)
- Todas as rotas `/admin/*` protegidas por proxy (middleware) do Next.js
