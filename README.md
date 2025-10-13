# Astrex — PWA de Notificações (Painel + Backend)

**O que tem aqui**:
- Frontend PWA (public/) com painel para criar título e descrição
- Service Worker para receber push e exibir notificações
- Backend em Node.js + Express que guarda subscriptions e envia push via web-push
- Arquivo `.env.example` e script para gerar VAPID keys

## Como usar (rápido)
1. Copie `.env.example` para `.env` e preencha as chaves VAPID (ou gere com `npm run gen-keys`):
   ```bash
   npm install
   npm run gen-keys
   ```
   Copie as chaves geradas para `.env` (VAPID_PUBLIC_KEY e VAPID_PRIVATE_KEY).
2. Inicie o servidor:
   ```bash
   npm start
   ```
3. Abra `http://localhost:3000` no navegador (Chrome/Firefox) e clique em **Ativar notificações**.
4. Use o painel para enviar notificações para todos os dispositivos registrados.

Observações:
- PWAs no iOS têm suporte limitado a push (iOS não suporta Web Push para PWAs até o momento de alguns SOs). No iOS, o usuário poderá instalar o site como PWA mas push pode não funcionar nativamente — recomenda-se usar um fallback (ex.: envio por SMS/email) ou integrar com um serviço nativo.
- Este projeto é um MVP. Para produção, armazene as chaves com segurança e adicione tratamento robusto de erros e limpeza das subscriptions inválidas.
