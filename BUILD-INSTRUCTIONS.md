# 📱 Como Buildar para Android e iOS

## Pré-requisitos para Build

### 1. **Instalar EAS CLI**
```bash
npm install -g @expo/eas-cli
```

### 2. **Login na Expo**
```bash
eas login
```

### 3. **Configurar projeto**
```bash
eas build:configure
```

## 🤖 **Build Android (APK)**

### Para Development (Teste)
```bash
eas build --platform android --profile development
```

### Para Production (Store)
```bash
eas build --platform android --profile production
```

### Para APK direto (mais rápido)
```bash
eas build --platform android --profile preview
```

## 🍎 **Build iOS**

### Para Development
```bash
eas build --platform ios --profile development
```

### Para Production (App Store)
```bash
eas build --platform ios --profile production
```

**⚠️ Nota:** iOS requer conta Apple Developer ($99/ano)

## ⚙️ **Configuração do eas.json**

Crie o arquivo `eas.json` na raiz do projeto:

```json
{
  "cli": {
    "version": ">= 13.2.1"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

## 📋 **Passos Completos**

### 1. **Primeiro Build**
```bash
# Entrar na pasta do projeto
cd C:\Users\diali\Downloads\g-well

# Instalar EAS CLI global
npm install -g @expo/eas-cli

# Login
eas login

# Configurar
eas build:configure

# Build APK para teste
eas build --platform android --profile preview
```

### 2. **Aguardar Build**
- O processo leva ~10-15 minutos
- Você receberá um link para download
- O APK pode ser instalado diretamente no Android

### 3. **Build Automático**
```bash
# Build para ambas as plataformas
eas build --platform all --profile preview
```

## 🔄 **Build Local (Alternativo)**

### Android
```bash
# Instalar Android Studio primeiro
# Depois executar:
npx expo run:android --variant release
```

### iOS (somente no macOS)
```bash
npx expo run:ios --configuration Release
```

## 📤 **Publicar na Loja**

### Google Play Store
```bash
eas submit --platform android --latest
```

### Apple App Store
```bash
eas submit --platform ios --latest
```

## 💡 **Dicas Importantes**

1. **APK vs AAB**: Para Play Store use AAB (padrão), para teste direto use APK
2. **Assinatura**: EAS gera automaticamente as chaves de assinatura
3. **Ícones**: Adicione os assets recomendados antes do build final
4. **Versioning**: Incremente a versão no app.json antes de cada build

## 🚀 **Comandos Rápidos**

```bash
# APK para teste (mais comum)
eas build --platform android --profile preview

# Ver builds em andamento
eas build:list

# Ver detalhes de um build
eas build:view [BUILD_ID]

# Cancelar build
eas build:cancel [BUILD_ID]
```

## 📁 **Arquivos Importantes**

- `app.json` - Configurações do app
- `eas.json` - Configurações de build
- `assets/` - Ícones e splash screens

**🎯 Para teste rápido, use sempre:**
```bash
eas build --platform android --profile preview
```

Isso gerará um APK que pode ser instalado diretamente no Android!
