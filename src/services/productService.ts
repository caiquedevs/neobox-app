import { CartFormData } from '../components/FormReplacement';
import { baseUrl } from '../utils/constants';

export const fetchPurchaseList = async () => {
  return fetch(`${baseUrl}/products?purchaseList=true`)
    .then((response) => {
      if (!response.ok) throw new Error('Erro na requisição: ' + response.status);
      return response.json();
    })
    .then((response) => response)
    .catch((error) => {
      throw new Error('Erro na requisicao');
    });
};

export const fetchReplacements = async () => {
  return fetch(`${baseUrl}/replacement`)
    .then((response) => {
      if (!response.ok) throw new Error('Erro na requisição: ' + response.status);
      return response.json();
    })
    .then((response) => response)
    .catch((error) => {
      throw new Error('Erro na requisicao');
    });
};

export const createReplacement = async (products: CartFormData[]) => {
  return fetch(`${baseUrl}/replacement`, {
    method: 'POST',
    body: JSON.stringify(products),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => {
      if (!response.ok) throw new Error('Erro na requisição: ' + response.status);
      return response.json();
    })
    .then((response) => response)
    .catch((error) => {
      throw new Error('Erro na requisicao');
    });
};
