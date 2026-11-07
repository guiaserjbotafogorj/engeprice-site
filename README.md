# Engeprice — proposta de renovação

Página institucional estática em português para apresentação do redesign. Preserva a paleta da marca e o logo. A revisão adota Archivo variável, links textuais sem setas e retratos com colorização conceitual sobre as fotos originais. Conteúdo técnico revisado, desenhos SVG próprios, animações leves, FAQ e triagem de contato.

- Prévia: https://engeprice-site.pages.dev/
- Repositório: https://github.com/guiaserjbotafogorj/engeprice-site
- Site oficial preservado: https://engeprice.com.br/

## Rodar

Requer Node.js 22 ou superior; nenhuma dependência de aplicação.

```sh
npm run build
npm run dev
```

Acesse http://127.0.0.1:4173. O conteúdo principal já está no HTML e permanece disponível sem JavaScript. Não há CMS nem hidratação de framework.

```sh
npm test
npm run check:placeholders
```

## Editar

- `content.pt-BR.json`: copy, FAQ, serviços, currículos e rótulos.
- `site.config.json`: identidade, canais e flags; dados divergentes ficam nulos e não são publicados.
- `src/style.css`: tokens, layouts, estados e movimento reduzido.
- `src/drawings.mjs`: desenhos conceituais da abertura e dos setores, com legendas que os distinguem de representações de empreendimentos reais.
- `REVISAO-DESIGN.md`: direção visual e critérios da revisão.
- `docs/COLORIZACAO.md`: fontes, saídas e prompt dos retratos; originais preservados.
- `docs/GOOGLE-E-CLIENTES.md`: identificação do perfil, origem dos logotipos e limites de confirmação.
- `scripts/build.mjs`: composição das seções e geração dos metadados/JSON-LD/arquivos técnicos.
- `assets/brand/`: arquivos da marca e espaço reservado para o manual.

As seções são funções independentes na composição e podem ser extraídas para páginas futuras. O blog não faz parte desta versão. `dist/` é a saída gerada, também versionada para facilitar revisão e comparação.

## Cloudflare Pages

Conta autorizada: `e516c1e7f49ee115f654e85e1fc1109b`.

- Repositório: `guiaserjbotafogorj/engeprice-site`
- Branch de publicação: `main`
- Framework: nenhum
- Build: `npm run build`
- Saída: `dist`
- Node: 22 ou superior

Commits em `main` geram nova implantação após a conexão Git. A prévia é pública para apresentação, com `noindex` no HTML e no cabeçalho. Isso não é controle de acesso.

## Configuração

Veja `.env.example`. O build lê variáveis do ambiente do processo; arquivos `.env` não são carregados automaticamente. No Pages, definir no painel. `GTM_ID`, `GSC_TOKEN`, `FORM_ENDPOINT`, `PREVIEW`, `SITE_URL` são variáveis de build. Segredos de e-mail pertencem exclusivamente ao ambiente servidor das Functions.

O build de produção indexável bloqueia domínio `pages.dev` e NAP não confirmado. Antes de usar `PREVIEW=false`, confirmar dados, trocar `SITE_URL` pelo domínio definitivo e revisar os arquivos gerados. O preview mantém o sitemap vazio para não sugerir indexação. `llms.txt` aponta claramente o site oficial.

## Formulário e e-mails

**Na prévia, não existe envio real.** O botão valida os campos e informa explicitamente que nada foi enviado. Não há armazenamento de leads ou envio de teste para a empresa.

A Function `functions/api/contact.js` prepara e-mail para a empresa e confirmação sóbria para o remetente pelo endpoint batch do Resend. Possui limite de corpo, validação de dados e opções, verificação de origem, consentimento, honeypot e exigência de rate limiter durável. Responde indisponível se não estiver completamente configurada.

Para ativação futura: validar responsável e retenção LGPD, configurar domínio remetente no provedor, `MAIL_FROM`, `MAIL_TO`, segredo `RESEND_API_KEY`, `CONTACT_ENABLED=true`, implementar/configurar binding durável `CONTACT_RATE_LIMITER` com método `limit({key})` (ou adaptar para solução suportada no projeto Pages/Worker), definir `FORM_ENDPOINT=/api/contact` no build e testar entrega e resposta reais com destinatários autorizados. O binding não é criado por esta proposta; sem ele a Function falha fechada. Não colocar chave de API nas variáveis públicas de build nem no Git.

A newsletter usa um link de solicitação por e-mail; não há inscrição automática nem coleta independente.

## Medição

Sem pixels de anúncio. GTM não está configurado e não carrega sem ID válido e consentimento. Eventos `cta_click`, `click_email`, `click_linkedin_socio`, `generate_lead` são preparados; os dois últimos canais opcionais `click_phone` e `click_whatsapp` só fazem sentido após confirmação/ativação. Nenhum telefone/WhatsApp aparece nesta versão. `generate_lead` exige resposta positiva do servidor; não dispara no modo demonstrativo. UTMs são persistidas na sessão e anexadas somente ao envio configurado. Não há dados pessoais no dataLayer.

## Validação e limites

Consulte `RELATORIO-VALIDACAO.md` e `TODO-CONFIRMAR.md`. A validação local de JSON-LD verifica sintaxe, tipos e correspondência ao FAQ visível; não equivale à aprovação do Google ou Schema.org. SEO/AEO/GEO técnico não garante posição, indexação, destaque de FAQ ou citações em IA. Search Console, GA4 e domínio oficial não foram alterados.

## SVGs, orçamento e conteúdo externo
Os SVGs são traçados durante 12 segundos, com leve defasagem entre partes, e iniciam ao entrar no campo de leitura. Sem JavaScript ou com movimento reduzido, o desenho permanece completo. A faixa de ferramentas distingue bases de preços e softwares e apresenta uma planilha conceitual, sem valores comerciais. O mapa do Google é um iframe oficial com carregamento preguiçoso; as informações nele exibidas pertencem à ficha pública, sem substituir a confirmação do NAP da empresa.
