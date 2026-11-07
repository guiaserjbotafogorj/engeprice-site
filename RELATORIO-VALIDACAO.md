# Validação da proposta Engeprice

Data: 07/11/2026. Publicação: https://engeprice-site.pages.dev/

## Estados de entrega

- Projeto local independente: `engeprice-site/`.
- GitHub: https://github.com/guiaserjbotafogorj/engeprice-site, branch `main`.
- Cloudflare Pages: conta `e516c1e7f49ee115f654e85e1fc1109b`, projeto `engeprice-site`, integrado ao GitHub. Build `npm run build`; saída `dist`.
- Domínio oficial `engeprice.com.br`: não alterado. Não houve mudança de DNS, Search Console ou GA4.
- A prévia é pública, com `noindex, nofollow` em HTML e cabeçalho. O sitemap de preview permanece vazio e o robots bloqueia rastreamento. Isso não constitui autenticação ou privacidade de acesso.

## Lighthouse na URL pública

Lighthouse 13.6.0, Chrome headless isolado, perfis mobile padrão e desktop. Relatórios completos em `reports/lighthouse-public-mobile.json` e `reports/lighthouse-public-desktop.json` (incluem data/hora, configuração, métricas e achados).

| Indicador | Celular | Computador |
| --- | ---: | ---: |
| Desempenho | 100 | 100 |
| Acessibilidade | 100 | 100 |
| Boas práticas | 100 | 100 |
| SEO | 69 | 69 |
| LCP | 1,08 s | 0,31 s |
| CLS | 0 | 0,00029 |
| TBT | 21 ms | 0 ms |

O SEO não atende ao critério numérico de 95 nesta prévia: o item reprovado é `is-crawlable`, pois a proposta não deve ser indexada. Não removemos a proteção para elevar a nota. A validação de uma produção indexável deverá ocorrer após aprovação, domínio definitivo e confirmação de dados.

As notas são medições de laboratório, não garantia de desempenho em qualquer conexão/aparelho. INP de campo não foi medido; TBT é dado de laboratório e não substitui INP. Não houve teste físico de iPhone. A medição pública antecede apenas o versionamento de cache dos retratos e a documentação final; a composição, CSS, fontes e comportamento medidos são os mesmos.

## Funcionalidade e responsividade

- Inspeção visual de desktop e celular de 390 px.
- Verificação de ausência de overflow horizontal em 320, 390, 768 e 1440 px.
- Menu móvel abre, fecha ao navegar e mantém `aria-expanded` coerente. Escape implementado.
- FAQ usa `details/summary` nativos; primeiro item foi aberto em teste no celular.
- Um único H1, sequência semântica de títulos, `lang=pt-BR`, foco visível e suporte a `prefers-reduced-motion`.
- Retratos com WebP, srcset, dimensões explícitas e lazy loading. Logo original preservado, versão WebP sem perda. SVG oficial não estava disponível.
- Correção de fonte no preload eliminou o CLS relevante no desktop. Revelações usam deslocamento sem reduzir contraste de texto fora da dobra.
- Formulário público preenchido com dados fictícios. Resultado observado: “Preenchimento validado. Nesta prévia, nenhum dado foi enviado.”

## Testes automatizados

`node --test scripts/*.test.mjs`: **8 testes aprovados**.

Cobertura: origem externa, campos obrigatórios/opções, consentimento, e-mail, honeypot, limite de corpo, falha fechada sem configuração, bloqueio por rate limit, geração de mensagem interna e confirmação com provedor simulado, eventos sem dados pessoais, consentimento de medição, UTMs de sessão e ausência de envio/lead na demonstração.

Eventos testados em ambiente simulado: `cta_click`, `click_email`, `click_linkedin_socio`, `generate_lead`, `click_phone`, `click_whatsapp`. Telefone e WhatsApp não aparecem na prévia por falta de confirmação; os testes desses canais validam a infraestrutura opcional, não cliques em controles atualmente publicados. Não há GTM/GA4 real configurado.

**Envio real e confirmação automática real não foram testados nem habilitados.** Dependem de provedor, domínio remetente, segredos, rate limiter durável e validação de privacidade. O teste do provedor é simulado e não dispara e-mail.

## SEO, AEO, GEO e JSON-LD

- Title, description, canonical da prévia, Open Graph, Twitter Card, favicon e imagem social.
- Texto principal no HTML, sem depender de execução de JavaScript.
- JSON-LD com `ProfessionalService`, dois `Person`, `OfferCatalog`/serviços e `FAQPage` com sete respostas equivalentes ao texto visível.
- Sintaxe e estrutura verificadas localmente, com correspondência integral do FAQ. Relatório: `reports/content-check.json`.
- NAP divergente não foi presumido: endereço e telefone foram omitidos; a configuração única prepara sua inclusão consistente no HTML e JSON-LD após confirmação.
- `npm run check:placeholders` aprovado; nenhum `[CONFIRMAR]` no HTML de entrega. Marcadores existem apenas na configuração de pendências.
- `llms.txt` descreve o caráter de prévia e identifica o site oficial.

Não houve validação externa pelo Schema.org Validator ou Google Rich Results Test. Não se afirma aprovação de rich results, ranking, indexação, citação por IA ou posicionamento no Maps. A marcação FAQ é descritiva e não pressupõe elegibilidade a resultado destacado.

## Links verificados

- Home, robots.txt, sitemap.xml, llms.txt e imagem social: HTTP 200 na URL pública.
- Todos os hrefs de âncoras possuem alvo; todos os ativos locais referenciados existem.
- Instagram: HTTP 200; resposta não equivale a autenticação da titularidade do perfil.
- LinkedIn do Diego: HTTP 999; LinkedIn da empresa: HTTP 403. Ambos restringiram o verificador automatizado e continuam pendentes de abertura autenticada. URLs foram preservadas conforme o briefing/site atual.
- E-mail: link `mailto`, sem teste de entrega.
- Relatório técnico dos links: `reports/http-links.json`.

## Aprovações e integrações pendentes

Consultar `TODO-CONFIRMAR.md`: manual e grafia da marca, dados divergentes, currículos, processo proposto de quatro etapas, direitos de fotos e referências de obras, LinkedIn de Renato, logos, privacidade definitiva e integrações de envio/medição. Nenhum número ou depoimento foi inventado. A newsletter está representada por solicitação de cadastro via e-mail, sem inscrição automática.
