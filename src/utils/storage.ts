import AsyncStorage from '@react-native-async-storage/async-storage';

export const asyncStorage = () => {
  const set = async (key: string, value: any) => {
    try {
      const item = await AsyncStorage.setItem(key, JSON.stringify(value));
      return item;
    } catch (error) {
      alert('Houve um erro ao setar persistencia de dados');
    }
  };

  const get = async <T>(key: string): Promise<T | undefined> => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) return JSON.parse(value);
    } catch (error) {
      alert('Houve um erro ao setar persistencia de dados');
    }
  };

  const remove = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      alert('Erro ao remover o dado:');
    }
  };

  return { get, set, remove };
};
