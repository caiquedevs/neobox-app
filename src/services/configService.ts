import { baseUrl } from '../utils/constants';

export const fetchConfig = async () => {
  return fetch(`${baseUrl}/settings`)
    .then((response) => response.json())
    .then((response) => response)
    .catch((error) => error);
};
