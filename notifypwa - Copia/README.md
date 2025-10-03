
# NotifyLab PWA (Gerador de Notificações)

PWA para criar notificações locais personalizadas (ícone, nome do app, título e descrição).

> **Atenção**: notificações locais funcionam enquanto o app estiver aberto/instalado e em foco. Para **notificar com o app fechado**, use Web Push (backend).

## Como usar
1. Suba essa pasta para um repositório no GitHub.
2. Ative **GitHub Pages** (Settings → Pages → Deploy from Branch → `main`/`/ (root)`).
3. Abra a URL, **Permitir Notificações**, selecione um preset (ex.: **Kiwify**), escreva título/descrição e clique **Iniciar**.

## Deploy rápido na Vercel
- `vercel` na pasta do projeto ou faça upload pelo dashboard.

## Personalização
- Ícones das notificações ficam em `/icons` (você pode substituir `swatch-*.png` a vontade).
- Para mudar **nome/ícone do app instalado**, edite `manifest.json` e os PNGs `icon-192.png` e `icon-512.png`.

## Web Push (opcional)
Para notificações com o app fechado, adicione um servidor de Web Push (Node + `web-push`) e trate `push` no `sw.js`.
