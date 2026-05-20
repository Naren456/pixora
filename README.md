pixora/
│
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx          # Home
│   │   ├── search.tsx
│   │   ├── collections.tsx
│   │   └── settings.tsx
│   │
│   ├── photo/
│   │   └── [id].tsx
│   │
│   └── _layout.tsx
│
├── src/
│   │
│   ├── components/
│   │   ├── PhotoCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── CollectionCard.tsx
│   │   └── Loader.tsx
│   │
│   ├── ai/
│   │   ├── embeddings.ts
│   │   ├── semanticSearch.ts
│   │   └── indexing.ts
│   │
│   ├── database/
│   │   ├── sqlite.ts
│   │   └── queries.ts
│   │
│   ├── services/
│   │   ├── media.ts
│   │   └── permissions.ts
│   │
│   ├── store/
│   │   └── useStore.ts
│   │
│   ├── hooks/
│   │   └── useSearch.ts
│   │
│   ├── utils/
│   │   └── helpers.ts
│   │
│   ├── constants/
│   │   └── colors.ts
│   │
│   └── types/
│       └── index.ts
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── models/
│
├── package.json
├── tsconfig.json
└── app.json