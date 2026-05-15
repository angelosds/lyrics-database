# Repositório de Letras — Ibero

Plataforma web para centralizar e compartilhar letras de músicas de uma banda, com área pública de consulta e área administrativa para gerenciamento.

## Visão Geral

**Problema:** Letras de músicas de uma banda espalhadas, sem um local único e acessível publicamente para consulta e compartilhamento.

**Solução:** Uma plataforma web onde qualquer pessoa pode acessar e compartilhar letras, e membros autorizados da banda podem gerenciar o conteúdo e criar setlists para shows.

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS + CSS custom properties |
| Banco de Dados | Neon (PostgreSQL serverless) |
| ORM | Drizzle ORM |
| Autenticação | NextAuth.js v5 |
| Hospedagem | Vercel |

## Funcionalidades

### Área Pública (sem login)
- Listagem de todas as músicas da banda
- Busca por título, intérprete, tema ou trecho de letra
- Visualização completa da letra de cada música
- URL amigável e compartilhável por música (ex: `/musicas/nome-da-musica`)
- Metadados por música: título, intérprete, ano, tom (key), BPM
- Temas exibidos como chips nas listagens e na página da música

### Área Administrativa (requer login)
- Login via credenciais (usuário + senha)
- Gerenciar músicas: criar, editar, arquivar
  - Campo de temas (tags separadas por vírgula) para categorizar músicas
- Editor de letras com suporte a formatação básica (versos, refrões, pontes)
- Gerenciar setlists:
  - Criar setlist para um evento (nome, data, local)
  - Adicionar/remover/reordenar músicas
  - Filtrar músicas disponíveis por tema ou título ao montar um setlist
  - Métricas por música no editor de setlist: quantas vezes esteve em setlist e data do último setlist
  - Visualizar e imprimir setlist
  - Compartilhar setlist publicamente via link

---

## Design System

> **O design system abaixo é a fonte da verdade para toda nova tela ou componente.**
> Ao implementar qualquer funcionalidade nova, consulte esta seção antes de escrever CSS ou markup.
> Não crie classes, tokens ou estilos fora deste sistema sem uma justificativa explícita.

O design foi gerado via [Claude Design](https://claude.ai/design) e implementado em `src/app/globals.css`. Todas as definições visuais estão lá como CSS custom properties e classes utilitárias.

### Identidade

- **Nome do produto:** Repositório de Letras
- **Wordmark:** `ibero` — lowercase, fonte DM Sans, 17px, weight 500
- O wordmark tem um dot `·` gerado via `::after` (ver classe `.wordmark` em `globals.css`)
- Na área admin, o wordmark exibe uma tag "ADMIN" via `::before` (classe `.wordmark.admin`)

### Tipografia

| Fonte | Uso | CSS Variable |
|-------|-----|--------------|
| DM Sans | Interface, labels, navegação, botões | `var(--font-sans)` |
| JetBrains Mono | Letras de músicas, tonalidade (key), BPM, slugs | `var(--font-mono)` |

**Escalas tipográficas** (classes CSS em `globals.css`):

| Classe | Tamanho | Uso |
|--------|---------|-----|
| `.display` | 44px, weight 500, tracking −0.03em | Títulos principais de página |
| `.title` | 28px, weight 500, tracking −0.025em | Títulos de seção |
| `.subtitle` | 18px, weight 400, `fg-muted` | Subtítulos e descrições |
| `.micro` | 11px, uppercase, tracking 0.04em, `fg-faint` | Rótulos de categoria |
| `.small` | 12px, `fg-muted` | Metadados, datas, contadores |
| `.mono` | JetBrains Mono | Qualquer dado musical ou código |
| `.muted` | — | Texto em `fg-muted` |
| `.faint` | — | Texto em `fg-faint` |

### Paleta de Cores (tokens CSS)

Todos os tokens estão definidos em `:root` em `src/app/globals.css`. **Nunca use valores hexadecimais diretamente nas páginas — use sempre os tokens.**

| Token | Valor | Uso |
|-------|-------|-----|
| `--bg` | `#ffffff` | Fundo principal |
| `--bg-elev` | `#fafafa` | Superfícies elevadas (cards, header admin, login bg) |
| `--bg-hover` | `#f5f5f5` | Estado hover de elementos interativos |
| `--fg` | `#0a0a0a` | Texto principal, ícones, bordas de foco |
| `--fg-muted` | `#6b6b6b` | Texto secundário, labels, nav inativa |
| `--fg-faint` | `#a3a3a3` | Texto terciário, placeholders, números de setlist |
| `--border` | `#e8e8e8` | Bordas padrão |
| `--border-strong` | `#d4d4d4` | Bordas em hover, divisores |
| `--danger` | `#b3261e` | Erros e alertas |
| `--danger-bg` | `#fdf0ee` | Fundo de alertas de erro |

### Espaçamento

| Token | Valor padrão | Uso |
|-------|-------------|-----|
| `--pad-x` | `24px` | Padding lateral global (containers, topbar, footer) |

Containers:
- `.container` — max-width 1180px, usado nas páginas públicas
- `.container-wide` — max-width 1200px, usado nas páginas admin

### Componentes

Todos os componentes abaixo já existem como classes CSS em `globals.css`. **Reutilize-os; não reinvente.**

#### Navegação

```html
<!-- Topbar pública -->
<header class="topbar">
  <a class="wordmark" href="/">ibero</a>
  <nav class="nav">
    <a href="/" class="active">Músicas</a>
    <a href="/setlists">Setlists</a>
  </nav>
</header>

<!-- Topbar admin (fundo bg-elev) -->
<header class="topbar" style="background: var(--bg-elev)">
  <a class="wordmark admin" href="/admin">ibero</a>
  ...
</header>
```

#### Botões

| Classe | Uso |
|--------|-----|
| `.btn` | Botão padrão (border, bg, hover) |
| `.btn-primary` | Ação principal — fundo `fg`, texto `bg` (invertido) |
| `.btn-ghost` | Sem borda, sem fundo — apenas hover sutil |
| `.btn-sm` | Versão compacta (28px altura) |
| `.btn-lg` | Versão grande (44px altura) — usado no login |
| `.btn-link` | Estilo de link sublinhado |

#### Inputs e Formulários

```html
<div class="field">
  <label>Nome do campo</label>
  <input class="input" type="text" />
  <div class="help">Texto de ajuda opcional</div>
</div>

<textarea class="textarea mono" rows="20"></textarea>
```

- `.input` e `.textarea` têm border `--border`, focus muda para `--fg`
- `.textarea.mono` usa JetBrains Mono — obrigatório para campos de letra

#### Badges

```html
<span class="badge badge-key">Am</span>   <!-- tonalidade, min-width 36px -->
<span class="badge badge-bpm">72</span>   <!-- BPM, prefixo ♪ via CSS -->
```

#### Cards

```html
<!-- Card base -->
<div class="card">...</div>

<!-- Card clicável com hover -->
<a class="card card-hover">...</a>

<!-- Song card (grid 1fr auto) -->
<a class="song-card">
  <div>
    <div class="song-title">Nome da Música</div>
    <div class="song-meta">Álbum · Ano</div>
  </div>
  <span class="badge badge-key">G</span>
</a>

<!-- Stat card (dashboard) -->
<div class="stat">
  <div class="stat-num">10</div>
  <div class="stat-lbl">músicas ativas</div>
</div>

<!-- Action card (dashboard) -->
<a class="action-card" href="/admin/musicas/nova">
  <span class="action-ico"><!-- SVG icon --></span>
  <span class="action-label">Nova Música</span>
  <span class="action-sub">Adicionar letra ao repositório</span>
</a>
```

#### Setlist Row

```html
<ol style="border-top: 1px solid var(--border)">
  <li class="setlist-row">
    <span class="num">01</span>
    <div>
      <a class="song-title-link">Nome da Música</a>
      <div class="small muted">Álbum · 72 bpm</div>
      <div class="note">Nota opcional do show</div>
    </div>
    <span class="badge badge-key">G</span>
  </li>
</ol>
```

#### Lyrics Block

```html
<div class="lyrics-block">{lyrics}</div>
```

Renderiza texto pré-formatado em JetBrains Mono com `white-space: pre-wrap`, fundo `bg-elev`.

#### Alertas

```html
<div class="alert">
  <!-- SVG de info -->
  <span>Mensagem de erro aqui.</span>
</div>
```

#### Busca

```html
<div class="search">
  <span class="search-icon"><!-- SVG lupa --></span>
  <input class="input" placeholder="Buscar…" />
</div>
```

#### Seção Arquivada (listas admin)

```html
<div class="archived-section">
  <div class="micro">Arquivadas</div>
  <div class="card" style="border-style: dashed">
    <!-- itens com opacity: 0.72 -->
  </div>
</div>
```

#### Icon Buttons

```html
<button class="icon-btn" title="Subir"><!-- SVG --></button>
```

28×28px, hover com `bg-hover`. Usado nos controles ↑↓× do editor de setlist.

### Ícones

Não use bibliotecas de ícones externas. Todos os ícones são SVGs inline com traço 1.6px, `strokeLinecap="round"`, `strokeLinejoin="round"`, tamanho padrão 14–18px.

Padrão para ícones de navegação (seta de voltar):
```html
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
  <path d="M19 12H5m6-7-7 7 7 7"/>
</svg>
```

### Empty State

Quando uma lista está vazia (ex: busca sem resultados), use o padrão com SVG de pauta musical — ver implementação em `src/app/(public)/page.tsx`.

### Padrões de Layout

- **Página pública:** `<div class="container" style="padding: 52px var(--pad-x) 60px">`
- **Página admin:** `<div class="container-wide" style="padding: 40px var(--pad-x) 56px">`
- **Link de voltar** no topo de cada página interna: inline-flex, gap 6, cor `fg-muted`, 13px
- **Títulos de página** usam `.display` no público e `.title` no admin
- **Subtítulo** logo abaixo do título com `.subtitle` ou `.small.muted`

### Regras de Estilo

1. **Não use classes do Tailwind para cores** — use `style="color: var(--fg-muted)"` com os tokens
2. **Não crie novas classes CSS** sem antes verificar que o componente não existe em `globals.css`
3. **Não use cores hex diretamente** em nenhum arquivo `.tsx` ou `.css`
4. **Espaçamentos de layout** usam `style` inline com os tokens (`var(--pad-x)`, etc.)
5. **Fontes mono** são obrigatórias para: letras, tonalidade, BPM, slugs, timestamps técnicos
6. **Transições** padrão: `background .12s, border-color .12s` — não use outros valores

---

## Modelo de Dados

```sql
-- Músicas
songs (
  id          uuid primary key,
  title       text not null,
  slug        text unique not null,
  lyrics      text not null,
  album       text,          -- coluna DB; mapeada para "interprete" no código Drizzle
  themes      text[],        -- temas/tags da música (ex: ["louvor", "adoração"])
  year        integer,
  key         text,          -- tom musical (ex: "C", "Am")
  bpm         integer,
  notes       text,          -- notas internas
  archived    boolean default false,
  created_at  timestamp,
  updated_at  timestamp
)

-- Métricas de uso em setlists (computadas via JOIN, não armazenadas):
-- • count de setlists: COUNT(*) FROM setlist_songs WHERE song_id = ?
-- • data do último setlist: MAX(setlists.event_date) JOIN setlist_songs

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
src/
├── app/
│   ├── (public)/               # rotas públicas
│   │   ├── layout.tsx          # header + footer público
│   │   ├── page.tsx            # listagem + busca de músicas
│   │   ├── musicas/[slug]/     # letra da música
│   │   └── setlists/[slug]/    # setlist público
│   ├── (admin)/                # rotas protegidas
│   │   ├── layout.tsx          # verifica auth + header admin
│   │   └── admin/
│   │       ├── page.tsx        # dashboard
│   │       ├── musicas/        # CRUD de músicas
│   │       └── setlists/       # CRUD de setlists
│   ├── api/auth/[...nextauth]/ # handler NextAuth
│   ├── login/                  # página de login
│   ├── globals.css             # ← DESIGN SYSTEM COMPLETO
│   └── layout.tsx              # root layout (fontes, metadata)
├── components/
│   ├── song-form.tsx           # formulário de música (client)
│   ├── setlist-editor.tsx      # editor interativo de setlist (client)
│   └── share-button.tsx        # botão de compartilhar (client)
├── db/
│   ├── schema.ts               # schema Drizzle
│   ├── index.ts                # conexão Neon (lazy proxy)
│   └── seed.ts                 # dados de exemplo
└── lib/
    ├── auth.ts                 # config NextAuth
    ├── utils.ts                # slugify, formatLyrics
    └── actions/
        ├── songs.ts            # Server Actions de músicas
        └── setlists.ts         # Server Actions de setlists
```

## Variáveis de Ambiente

```env
DATABASE_URL=postgres://...?sslmode=require
AUTH_SECRET=...   # openssl rand -base64 32
AUTH_URL=http://localhost:3000
```

## Comandos de Desenvolvimento

```bash
npm run dev          # servidor local
npm run build        # build (inclui drizzle-kit push)
npm run db:generate  # gera migrations a partir do schema
npm run db:migrate   # aplica migrations
npm run db:studio    # UI do banco (Drizzle Studio)
npm run db:seed      # popula com dados de exemplo
```

## Convenções

- Slug gerado automaticamente a partir do título (slugify)
- Letras em texto plano, estrofes separadas por linha em branco
- Todas as rotas `/admin/*` protegidas por `src/proxy.ts` (middleware Next.js 16)
- Sem registro público — usuários criados via seed ou Drizzle Studio
- `drizzle-kit push` roda automaticamente no `npm run build` (usado pelo Vercel)
