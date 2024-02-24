import { baseUrl } from '../utils/constants';

export const fetchProducts = async () => {
  return fetch(`${baseUrl}/stock`)
    .then((response) => response.json())
    .then((response) => response)
    .catch((error) => error);
};
