import { baseUrl } from '../utils/constants';

export const fetchConfig = async () => {
  return fetch(`${baseUrl}/settings`)
    .then((response) => {
      if (!response.ok) throw new Error('Erro na requisição: ' + response.status);
      return response.json();
    })
    .then((response) => response)
    .catch((error) => error);
};
