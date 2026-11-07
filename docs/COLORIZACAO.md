# Colorização dos retratos

Ferramenta: ImageGen integrada (sem CLI). Uso: camada ilustrativa de cor na proposta conceitual. Os arquivos originais permanecem intactos.

## Arquivos

- Originais: `assets/people/diego-original.png` e `assets/people/renato-original.png`.
- Saídas selecionadas: `assets/people/diego-colorized-source.png` e `assets/people/renato-colorized-source.png`.
- Camadas responsivas consumidas pelo site: `assets/people/diego-color-360.webp`, `diego-color-640.webp`, `renato-color-360.webp` e `renato-color-640.webp`.

A composição usa `mix-blend-mode: color` sobre os retratos originais. A luminância e a geometria visíveis vêm do original; a camada gerada contribui com a cor. As cores são conceituais, não evidência dos tons ou roupas reais. A página identifica a colorização junto à seção dos sócios. Fotografias originais em cores podem substituir essas camadas quando disponíveis.

## Prompt utilizado, uma chamada por retrato

> Use case: identity-preserve. Edit target: the supplied black-and-white portrait. Perform ONLY a restrained, natural photographic colorization for a conceptual website proposal. Preserve the exact person, facial features, age, expression, hair, beard, skin texture, eyes, hands, body, pose, clothing pattern, folds, watch if present, framing, crop and background geometry. Do not retouch, beautify, reshape, add details, relight or replace anything. Add plausible subdued natural skin tones, dark brown hair/beard (preserve grey strands), neutral muted blue-grey clothing, neutral background. Original luminance and detail should stay unchanged; this is restoration by adding chrominance, not generating a new portrait. One single square portrait, same composition as input, no text, no watermark, no borders. Colors are illustrative, not a claim about original clothing colors.
