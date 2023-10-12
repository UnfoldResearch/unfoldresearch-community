import { apiFactory } from 'unfold-api';
import { CONFIG } from 'unfold-core';
import { extStorage } from 'unfold-utils';

const { protocol, domain, port } = CONFIG[process.env.NODE_ENV === 'production' ? 'prod' : 'dev'];
const urlBase = `${protocol}://${domain}${port ? `:${port}` : ''}`;

const api = apiFactory({
  urlBase,
  accessTokenGetter: () => extStorage.get('auth::access_token', '') || null,
});

export default api;
