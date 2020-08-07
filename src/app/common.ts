import { HttpHeaders } from '@angular/common/http';

export const API_BASE_URL = 'https://demomocktradingserver.azurewebsites.net';

export const WS_URL = API_BASE_URL.replace(/^https:/, 'wss:');

export const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
