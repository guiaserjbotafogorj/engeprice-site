# Revisão de design — 07/11/2026

## Critério
O site deve permitir que um cliente indicado reconheça a atuação da Engeprice, conheça os sócios e saiba como iniciar uma conversa técnica. O visitante já traz uma indicação; não precisa de slogans e chamadas repetidas.

A comparação foi feita com a página publicada, o logo e os conteúdos profissionais existentes. A revisão identificou repetição de setas, índices sem significado sequencial, legendas genéricas e uma tipografia editorial distante do desenho da marca.

## Direção escolhida
- Preto da marca `#0B1517`; dourado `#F3CC51` para sinalização; papel claro `#F5F3ED` e branco `#FFFFFF` para leitura; cinza de texto `#52615C`; divisórias `#D5DAD7`.
- Archivo variável, hospedada localmente: 600 nos títulos, 400 na leitura e 500 nos links. As letras sem serifa, abertas e com presença mais técnica acompanham melhor o logo. Sugestão tipográfica da proposta, sujeita à aprovação da marca.
- Composição da primeira versão preservada: abertura em duas colunas, frase de destaque em dourado, alternância de papel claro/preto e faixa dourada no processo. Conteúdo alinhado à esquerda. Limite de leitura em torno de 65 caracteres. Corpo de 15–17 px, rótulos de 12–14 px.
- Serviços em linhas de escopo, não uma coleção de cartões. Numeração apenas nas etapas que formam uma sequência. Experiência acompanhada por SVGs com legendas de ilustração conceitual dos setores, sem apresentá-los como desenhos das obras citadas.
- Um desenho estrutural na abertura concentra a personalidade visual. Traçados normalizados de 12 segundos, sem atrasos entre elementos; desenhos da mesma fileira começam juntos quando entram na área de leitura. Sem flutuação infinita; movimento reduzido mostra o desenho completo.
- Links textuais sublinhados, sem setas e sem moldura de botão. Ações reais (validar formulário, abrir menu, escolher medição, alternar a cor da foto) preservam semântica de botão e apresentação discreta.

```text
[logo + Proposta conceitual]      [serviços experiência sócios perguntas contato]
[engenharia de custos / título]  [desenho estrutural + legenda factual]
[contato por link / serviços]    [ilustração sem vínculo com obras reais]
[serviço] [o que analisa] [entregas pertinentes]
[SVG conceitual do setor + legenda] [nome da obra + contexto profissional]
[foto + legenda nominal] [sócio + currículo + LinkedIn]
[perguntas e respostas]          [contato e triagem demonstrativa]
[identificação da empresa]       [Desenvolvido pela Guia-se Botafogo]
```

A primeira composição repetia o mesmo tratamento em chamadas, retratos e projetos. A revisão corta os ícones de seta, os índices de enfeite, as legendas que podiam sugerir uma representação real dos empreendimentos. A hierarquia passa a depender de texto, escala e espaçamento.

## Fotos
Os originais públicos são monocromáticos. O usuário autorizou colorização conceitual em 07/11/2026. As versões geradas são usadas apenas como camada de cor sobre a foto original, preservando a luminosidade e os detalhes do retrato de origem. As cores não documentam as roupas ou tons originais.

Interação: hover em dispositivos com mouse; toque alterna entre monocromático e cor; Enter e Espaço fazem a mesma ação. O toque que inicia uma rolagem não deve alternar a foto. O estado é anunciado por `aria-pressed`; preferência por movimento reduzido elimina a transição.

## Complementos
Bases e plataformas foram separadas em um quadro de trabalho, acompanhado por uma planilha simbólica de orçamento. Os clientes aparecem em uma faixa de marcas com dimensão óptica equilibrada e sem carrossel automático. O perfil verificado no Google foi incorporado junto ao contato, com indicação de fonte e link para a ficha pública.

## Base visual preservada
A primeira versão define a composição, o uso do dourado, as proporções da abertura, os quatro projetos lado a lado no desktop e as frases de foco antes do contato. A melhoria aprovada para os serviços foi mantida em linhas de escopo. Archivo atualiza a tipografia; links, fotos interativas, clientes, planilha conceitual e Google complementam a mesma identidade. Os subcaminhos dos SVGs foram normalizados separadamente para evitar reinícios de fase e fragmentos fora de cadência.
