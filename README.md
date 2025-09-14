# 💎 Comissões de Joias

Um aplicativo minimalista e elegante para calcular comissões de vendas de joias, desenvolvido em React Native com Expo.

## ✨ Funcionalidades

- **Dashboard intuitivo** com estatísticas de vendas e comissões
- **Gestão de vendas** - adicionar, editar e excluir vendas
- **Relatórios detalhados** com filtros por período e ordenação
- **Taxa de comissão personalizável** (padrão: 10%)
- **Design minimalista** e moderno
- **Filtros avançados** por data, valor e período
- **Armazenamento local** - dados salvos no dispositivo

## 🚀 Como executar o projeto

### Pré-requisitos

Certifique-se de ter instalado:
- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Expo CLI** (opcional, mas recomendado)

### Passo a passo

1. **Clone ou extraia o projeto:**
   ```bash
   # Se usando git
   git clone <url-do-projeto>
   cd g-well
   
   # Ou simplesmente navegue para a pasta do projeto
   cd g-well
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```
   ou
   ```bash
   yarn install
   ```

3. **Inicie o projeto:**
   ```bash
   npx expo start
   ```
   ou
   ```bash
   npm start
   ```

4. **Execute no dispositivo:**
   - **Android**: Pressione `a` no terminal ou escaneie o QR Code com o app Expo Go
   - **iOS**: Pressione `i` no terminal ou escaneie o QR Code com a câmera do iPhone
   - **Web**: Pressione `w` no terminal para abrir no navegador

### Comandos alternativos

```bash
# Para Android específico
npm run android

# Para iOS específico  
npm run ios

# Para Web específico
npm run web
```

## 📱 Como usar o app

### 1. Dashboard
- Visualize suas estatísticas de comissões (hoje, semana, mês, total)
- Veja as vendas mais recentes
- Use o botão "+" para adicionar uma nova venda

### 2. Adicionar Vendas
- Preencha o tipo de joia (sugestões disponíveis)
- Insira o valor da venda
- Selecione a data
- Adicione uma descrição opcional
- Salve a venda

### 3. Relatórios
- Acesse relatórios detalhados de todas as vendas
- Filtre por período: hoje, semana, mês ou personalizado
- Ordene por data ou valor
- Visualize estatísticas consolidadas

### 4. Configurações
- Ajuste a taxa de comissão (padrão: 10%)
- Acesse informações sobre o app
- Resetar configurações se necessário

## 🎨 Design

O app utiliza um design minimalista com:
- **Paleta de cores moderna** com tons de azul (#6366f1) como cor principal
- **Cards com sombras suaves** para melhor hierarquia visual
- **Gradientes elegantes** nas estatísticas
- **Iconografia consistente** com Ionicons
- **Tipografia limpa** e legível
- **Espaçamentos harmônicos** para melhor experiência

## 💾 Armazenamento

- Todos os dados são salvos localmente no dispositivo usando AsyncStorage
- Não há conexão com servidores externos
- Dados persistem entre sessões do app
- Backup automático não está incluído (dados ficam apenas no dispositivo)

## 🔧 Tecnologias utilizadas

- **React Native** - Framework principal
- **Expo** - Plataforma de desenvolvimento
- **Expo Router** - Navegação baseada em arquivos
- **AsyncStorage** - Armazenamento local
- **Expo Vector Icons** - Ícones
- **React Native DateTimePicker** - Seleção de datas
- **Expo Linear Gradient** - Gradientes

## 📄 Estrutura do projeto

```
├── app/                    # Telas do app (Expo Router)
│   ├── (tabs)/            # Navegação por tabs
│   │   ├── index.js       # Dashboard
│   │   ├── reports.js     # Relatórios
│   │   └── settings.js    # Configurações
│   ├── add-sale.js        # Adicionar/editar venda
│   └── _layout.js         # Layout principal
├── components/            # Componentes reutilizáveis
│   ├── Button.js         # Botão personalizado
│   ├── Card.js           # Cards e componentes de exibição
│   ├── DatePicker.js     # Seletor de data
│   ├── Input.js          # Input personalizado
│   └── index.js          # Exportações
├── utils/                 # Utilitários
│   ├── helpers.js        # Funções auxiliares
│   └── storage.js        # Gerenciamento de armazenamento
└── assets/               # Imagens e ícones
```

## 🐛 Solução de problemas

### Metro bundler não inicia
```bash
npx expo start --clear
```

### Erro de dependências
```bash
rm -rf node_modules package-lock.json
npm install
```

### App não carrega no dispositivo
- Certifique-se que o dispositivo e computador estão na mesma rede WiFi
- Reinstale o app Expo Go
- Tente usar o modo tunnel: `npx expo start --tunnel`

## 📧 Suporte

Em caso de dúvidas ou problemas:
1. Verifique se todas as dependências foram instaladas corretamente
2. Certifique-se de que o Node.js está atualizado
3. Limpe o cache do Expo: `npx expo start --clear`

---

**Desenvolvido com ❤️ para simplificar o cálculo de comissões de joias**
