# Paggo OCR - Inteligência Artificial para Documentos

Soluçãopara gestão de documentos com extração de texto (OCR) e resumos inteligentes via IA, focada em precisão e experiência do usuário.

Funcionalidades
* **Autenticação**: Login e registro com JWT.
* **Processamento**: Upload de JPG/PNG com extração OCR.
* **Inteligência**: Resumos executivos automáticos via Gemini 1.5 Flash.
* **Histórico**: Busca por nome/ID e visualização detalhada.
* **Interface**: UI moderna com scroll, botões de cópia e cabeçalho dark mode.

Tecnologias
* **Frontend**: Next.js, TailwindCSS, TypeScript.
* **Backend**: NestJS, Prisma ORM, SQLite.
* **IA**: Groq meta-llama/llama-4-scout-17b-16e-instruct
## Configuração e Instalação
### 1. Backend
```bash
cd backend
npm install
# Crie o arquivo .env com:
# DATABASE_URL="file:./dev.db"
# GROQ_API_KEY="SUA_CHAVE_AQUI"
# JWT_SECRET="SEGREDO_JWT"
npx prisma migrate dev --name init
npm run start:dev
```

### 2. Frontend
```bash
cd frontend
npm install
# Crie o arquivo .env.local com:
# NEXT_PUBLIC_API_URL="http://localhost:3000"
npm run dev
```

### 

### 1. Backend

