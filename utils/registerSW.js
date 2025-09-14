// Registrar Service Worker para PWA offline
export const registerSW = () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registrado com sucesso:', registration.scope);
          
          // Verifica por atualizações
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nova versão disponível
                console.log('Nova versão do app disponível!');
              }
            });
          });
        })
        .catch((error) => {
          console.log('Falha ao registrar SW:', error);
        });
    });

    // Escuta mensagens do Service Worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
        // Notificar usuário sobre atualização
        console.log('Atualização disponível!');
      }
    });

    // Detecta quando o app volta online
    window.addEventListener('online', () => {
      console.log('App está online novamente');
      // Sincronizar dados se necessário
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SYNC_DATA'
        });
      }
    });

    // Detecta quando o app fica offline
    window.addEventListener('offline', () => {
      console.log('App está offline - usando cache');
    });
  }
};

// Instalar prompt do PWA (A2HS - Add to Home Screen)
export const setupInstallPrompt = () => {
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Previne o prompt automático
    e.preventDefault();
    deferredPrompt = e;
    
    // Aqui você pode mostrar seu próprio botão de instalar
    console.log('PWA pode ser instalado!');
  });

  // Função para mostrar o prompt de instalação
  const showInstallPrompt = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      deferredPrompt = null;
    }
  };

  return { showInstallPrompt };
};

// Verificar se é PWA instalado
export const isPWAInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
};
