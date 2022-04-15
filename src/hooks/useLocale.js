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
    myNarratives: 'My Narratives',
    addNarrative: 'Add Narrative',
    modified: 'Modified',
    created: 'Created',
    preview: 'Preview',
    editor: 'Editor',
    published: 'Published',
    download: 'Download my data',
  },
  pt: {
    gallery: 'Galeria de Mapas',
    signUp: 'Registrar',
    manage: 'Gerenciar Meus Mapas',
    login: 'Entrar',
    filterCategory: 'Filtrar por categoria',
    categories: en => categoriesPT[en],
    myNarratives: 'Minhas narrativas',
    addNarrative: 'Nova narrativa',
    modified: 'Modificado',
    created: 'Criado',
    preview: 'Pré-visualização',
    editor: 'Editor',
    published: 'Publicado',
    download: 'Baixar meus dados',
  },
};

const useLocale = () => {
  const { locale } = useRouter();
  return translations[locale];
};

export default useLocale;
