import { useRouter } from 'next/router';

const categoriesPT = {
  History: 'Historia',
  Architecture: 'Arquitetura',
  Literature: 'Literatura',
  Urbanism: 'Urbanismo',
  Archaelogy: 'Arqueologia',
  Environment: 'Ambiente',
};

const translations = {
  en: {
    gallery: 'Map Gallery',
    signUp: 'Sign Up',
    manage: 'Manage My Maps',
    login: 'Login',
    filterCategory: 'Filter by category',
    categories: en => en,
  },
  pt: {
    gallery: 'Galeria de Mapas',
    signUp: 'Registrar',
    manage: 'Gerenciar Meus Mapas',
    login: 'Entrar',
    filterCategory: 'Filtrar por categoria',
    categories: en => categoriesPT[en],
  },
};

const useLocale = () => {
  const { locale } = useRouter();
  return translations[locale];
};

export default useLocale;
