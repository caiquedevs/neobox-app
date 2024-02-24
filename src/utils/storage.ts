import AsyncStorage from '@react-native-async-storage/async-storage';

export const setStorage = async (key: string, value: any) => {
  try {
    const item = await AsyncStorage.setItem(key, JSON.stringify(value));
    return item;
  } catch (error) {
    alert('Houve um erro ao setar persistencia de dados');
  }
};

export const getStorage = async <T>(key: string): Promise<T | undefined> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) return JSON.parse(value);
  } catch (error) {
    alert('Houve um erro ao setar persistencia de dados');
  }
};

export const removeStorage = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    alert('Dado removido com sucesso!');
  } catch (error) {
    alert('Erro ao remover o dado:');
  }
};
