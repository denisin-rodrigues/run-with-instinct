# Cinematic Hero Pattern

Este documento descreve o padrão visual "Cinematic Hero" utilizado no projeto John Deere Midnight Editorial. Este padrão é inspirado em sites editoriais de alto nível (Puma, Nike) e foca em impacto visual e movimento.

## Princípios de Design

1.  **Fundo Dinâmico:** Substituir fundos estáticos ou gradientes por vídeos ou sequências de animação (Canvas) em tela cheia.
2.  **Texto Dividido (Split Layout):** Título dividido em dois blocos ancorados nas extremidades inferiores:
    *   **Bottom-Left:** Fragmento curto/abertura.
    *   **Bottom-Right:** Fragmento de fechamento/marca/ação.
3.  **Vão Central:** O centro da seção deve permanecer livre para destacar o movimento do fundo.
4.  **Legibilidade:** Uso de overlay escuro (`rgba(0,0,0, 0.35)` a `0.55`) para garantir contraste do texto branco.

## Template de Prompt para IA

> A seção hero possui atualmente [DESCRIÇÃO ATUAL] com [DESCRIÇÃO TEXTO].
> Eu preciso de duas mudanças:
>
> **1. Background:**
> Substituir o fundo [COR/IMAGEM] pela [NOME DO ASSET] que já existe no projeto. Deve ser em tela cheia, cobrindo toda a seção hero por trás de todos os elementos. Definir como autoplay, loop e mute. Adicionar um overlay escuro sutil (rgba 0,0,0, [OPACIDADE]%) para legibilidade.
>
> **2. Text layout:**
> Dividir o título em dois fragmentos posicionados na base da seção hero:
> - "[TEXTO ESQUERDA]" — ancorado no canto inferior esquerdo, branco, negrito, caixa alta.
> - "[TEXTO DIREITA]" — ancorado no canto inferior direito, branco, negrito, caixa alta.
>
> Ambos próximos à base, em lados opostos, com o centro livre — exatamente como o layout da Puma.

## Diretrizes de Opacidade

*   Cenas Escuras: 20-30%
*   Cenas Médias (Campos, Movimento): 35-45%
*   Cenas Claras (Luz do dia): 45-55%
