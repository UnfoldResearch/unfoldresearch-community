import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';
import 'unfold-ui/src/style.scss';
import './style/index.scss';

import { NavigationProvider } from './utils/useNavigation';
import { AuthProvider } from './utils/useAuth';
import { PageDataProvider } from './utils/usePageData';

createRoot(document.getElementById('content-script-root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <NavigationProvider>
        <PageDataProvider>
          <App />
        </PageDataProvider>
      </NavigationProvider>
    </AuthProvider>
  </React.StrictMode>,
);
