import { CartFormData } from '../components/FormReplacement';
import { ProductType } from '../interfaces/product';
import { Replacement } from '../interfaces/replacement';

export const formatFormReplacementData = (replacements: Replacement[]): CartFormData[] => {
  const formated = replacements.map((replacement) => {
    const productType = replacement.productType as ProductType;
    const qtd = productType === 'unit' ? replacement.qtd : replacement.qtd / replacement.burdenUnits;
    const pricePaid = replacement[productType].pricePaid;

    return {
      _id: replacement._id,
      burdenUnits: replacement.burdenUnits,
      total: qtd * pricePaid,
      pricePaid: pricePaid.toString(),
      qtd: qtd.toString(),
      productType,
    };
  });

  return formated;
};
