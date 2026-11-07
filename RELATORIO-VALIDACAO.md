# Revisão da proposta Engeprice — 07/11/2026

Prévia: https://engeprice-site.pages.dev/ · GitHub: https://github.com/guiaserjbotafogorj/engeprice-site

## Resultado da revisão

A proposta passou por revisão de tipografia, composição, copy, imagens, navegação, acessibilidade e estados de interação. Direção e comparação com a versão anterior: `REVISAO-DESIGN.md`.

- Archivo variável substitui Heebo e Playfair Display na interface; uma família, hospedada localmente, com pesos adequados a cada nível de informação. A composição e a paleta da primeira versão são a base, com papel claro, preto esverdeado e presença do dourado.
- Chamadas passam a ser links textuais, sem setas, molduras ou ícones isolados. Ações de interface preservam a semântica correta de botão, com apresentação de link: menu, submissão de formulário, medição e alternância das fotos.
- Serviços em linhas de escopo; numeração apenas na sequência de trabalho. Foram retirados índices decorativos, ícones genéricos e entradas de animação repetidas. A composição editorial original e as frases de foco foram preservadas.
- Cabeçalho identifica “Proposta conceitual”. Rodapé apresenta o crédito “Desenvolvido pela Guia-se Botafogo”, com link para https://botafogo.guiaserj.com.br/sites.
- O desenho da abertura possui legenda descritiva e informa seu caráter conceitual. Os SVGs da experiência foram preservados, com legendas de ilustração conceitual dos setores e nota que os distingue de desenhos dos empreendimentos reais.
- Legendas das fotos identificam os respectivos sócios. A colorização conceitual está informada junto à seção.
- Fotos: hover no mouse; toque/clique alterna a cor, e Enter/Espaço operam o controle. Estado e nome acessíveis são atualizados. A cor é uma camada sobre os originais monocromáticos, preservando sua luminosidade e detalhes. Prompt e caminhos em `docs/COLORIZACAO.md`.
- A imagem social e a página 404 acompanham o novo tratamento tipográfico; não há setas decorativas nelas.
- Bases de preços e plataformas em grupos próprios, com planilha conceitual de orçamento e fórmula de somatória dos custos.
- Seis marcas recuperadas do site atual em uma faixa de clientes e instituições; Odebrecht identificada como referência histórica. Origem documentada em `docs/GOOGLE-E-CLIENTES.md`.
- Perfil correto do Google identificado pelo site oficial informado na ficha. Iframe oficial incorporado, com link para a ficha, reserva de espaço e lazy loading. NAP próprio permanece pendente.
- Os SVGs têm 12 segundos de traçado, sem atrasos individuais. Subcaminhos conectados foram normalizados separadamente. Desenhos da mesma fileira iniciam juntos. Em verificação no navegador, todos os traços dos quatro projetos tinham `animation-duration: 12s`, atraso `0s` e progresso idêntico. Evidência: `reports/svg-synchronization.json`.

## Auditorias da revisão

Lighthouse 13.6.0, Chrome headless isolado. Conferência local da revisão com clientes, mapa, planilha conceitual e traçado lento:

| Indicador | Celular | Computador |
| --- | ---: | ---: |
| Desempenho | 100 | 100 |
| Acessibilidade | 100 | 100 |
| Boas práticas | 100 | 100 |
| SEO | 69 | 69 |
| LCP | 1,26 s | 0,29 s |
| CLS | 0 | 0 |
| TBT | 7 ms | 0 ms |

Relatórios: `reports/lighthouse-review-local-mobile.json` e `reports/lighthouse-review-local-desktop.json`. São medições de laboratório, não promessa para todo dispositivo/conexão. TBT não substitui INP; não houve medição de campo nem teste físico de iPhone.

A nota de SEO reflete a reprovação intencional de `is-crawlable`: a proposta deve permanecer fora da indexação, com noindex no HTML/cabeçalho e bloqueio em robots.txt. O critério numérico de SEO 95 não se aplica a esta prévia bloqueada; não foi removida a proteção para elevar a nota. Não há garantia de ranking, destaque de FAQ ou citação por IA.

## Conferência visual e funcional

- Abertura, serviços, retratos, perguntas, formulário e rodapé inspecionados no navegador.
- Larguras de 320, 360, 390, 768, 1024 e 1440 px: sem overflow horizontal e sem textos/campos cortados na verificação de limites.
- Menu: abre, fecha ao navegar e responde a Escape; `aria-expanded` acompanha o estado.
- Fotos: ativação/desativação e rótulo acessível verificados. Hover com `aria-pressed=false` mantém a camada de cor visível apenas enquanto o ponteiro está sobre a foto. Em viewport móvel, clique/toque usa alternância persistente. A emulação de largura não substitui teste em aparelho físico.
- FAQ: abre e fecha nativamente, com indicação textual “Ler resposta”/“Fechar resposta”.
- Formulário: preenchido com dados fictícios; mensagem observada informa expressamente que nada foi enviado. Sem JavaScript, a submissão fica desabilitada, com orientação de contato por e-mail; evita o envio involuntário dos campos por query string.
- Medição: preferências abrem, podem ser recusadas e fecham corretamente. GTM/GA4 continuam sem configuração real.
- Um H1, foco visível, skip link, rótulos explícitos dos campos, botões nativos para ações e `prefers-reduced-motion`.

## Verificações automatizadas

`node --test scripts/*.test.mjs`: **9 testes aprovados**.

Cobrem consentimento/eventos de contato, persistência de UTMs, ausência de PII no dataLayer, ausência de envio na demonstração, estado/rótulo da colorização, validação no servidor, origem externa, honeypot, limite de corpo, rate limit e mensagens de e-mail com provedor simulado. Não foi realizado envio real.

`scripts/check-content.mjs`: JSON-LD com `ProfessionalService`, dois `Person`, `OfferCatalog` e sete respostas de `FAQPage` correspondentes ao conteúdo; âncoras com alvo, ativos existentes, dois controles de foto, crédito correto, ausência de setas decorativas e de marcadores de confirmação. Resultado em `reports/content-check.json`. Validação local de estrutura/sintaxe não equivale à aprovação externa de Schema.org ou Google.

## Links e limites preservados

- Crédito da Guia-se Botafogo: HTTP 200 na revisão.
- LinkedIn do Diego e da empresa: as restrições do verificador anterior (999/403) não foram interpretadas como links quebrados. Verificação autenticada continua pendente; o LinkedIn do Renato não foi inventado.
- Endereço, telefone e volume orçado divergentes continuam omitidos. Valores centralizados em `site.config.json`.
- Formulário e newsletter são demonstrativos; integração de envio, provedor, rate limit durável e privacidade definitiva dependem de configuração/validação. Nenhum e-mail foi disparado.
- O fluxo de trabalho é identificado como proposta a ser validada com os sócios. Currículos, referências de obras, direitos de imagem e cores originais permanecem sujeitos à aprovação.
- O domínio oficial, DNS, Search Console e GA4 não foram alterados. Publicação restrita à prévia pages.dev, conectada à branch main.
