# Assets do App

Esta pasta deve conter as seguintes imagens para o funcionamento completo do app:

## Ícones necessários:

### icon.png
- **Tamanho**: 1024x1024 px
- **Formato**: PNG com transparência
- **Descrição**: Ícone principal do app
- **Sugestão**: Desenho minimalista de um diamante ou joia em tons de azul (#6366f1)

### adaptive-icon.png
- **Tamanho**: 1024x1024 px
- **Formato**: PNG com transparência
- **Descrição**: Versão do ícone para Android com área segura
- **Sugestão**: Mesmo design do icon.png, mas centralizado com margem

### splash.png
- **Tamanho**: 1284x2778 px (iPhone 13 Pro Max)
- **Formato**: PNG
- **Descrição**: Tela de carregamento
- **Fundo**: #f8f9fa (cinza claro)
- **Sugestão**: Logo centralizada com texto "Comissões de Joias" abaixo

### favicon.png
- **Tamanho**: 48x48 px
- **Formato**: PNG
- **Descrição**: Ícone para versão web
- **Sugestão**: Versão simplificada do ícone principal

## Como criar os assets:

1. **Usando ferramentas online:**
   - Canva, Figma, ou Adobe Illustrator
   - Utilize as cores do app: #6366f1 (azul principal), #f8f9fa (fundo)

2. **Usando IA para gerar imagens:**
   - DALL-E, Midjourney, ou similar
   - Prompt sugerido: "Minimalist diamond/jewelry icon, blue gradient, clean design, app icon style"

3. **Assets gratuitos:**
   - Unsplash, Pexels para referências
   - Flaticon para ícones base (lembrar de creditar)

## Exemplo de comando para gerar com Expo:

```bash
npx @expo/image-utils resize icon.png 48 --out favicon.png
```

**Importante**: Enquanto estes assets não estiverem disponíveis, o app funcionará normalmente, mas exibirá ícones padrão do Expo.
