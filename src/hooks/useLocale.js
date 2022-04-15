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
    editNarrative: 'Edit Narrative',
    submit: 'Submit for publication approval',
    title: 'Title',
    description: 'Description',
    image: 'Image',
    chooseFile: 'Choose File',
    tags: 'Tags',
    category: 'Category',
    cancel: 'Cancel',
    save: 'Save',
    deleteProject: 'Delete Project',
    deleteQuestion: 'Delete this narrative?',
    deleteConfirm:
      'Are you sure you want to delete this narrative? This action is permanent and cannot be undone.',
    categorySelect: 'Select a category',
    tagSelect: 'Select tags',
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
    editNarrative: 'Editar narrativa',
    submit: 'Enviar para aprovação de publicação',
    title: 'Título',
    description: 'Descrição',
    image: 'Imagem',
    chooseFile: 'Escolher arquivo',
    tags: 'Tags',
    category: 'Categoria',
    cancel: 'Cancelar',
    save: 'Salvar',
    deleteProject: 'Excluir projeto',
    deleteQuestion: 'Excluir esta narrativa?',
    deleteConfirm: 'Tem certeza de que deseja excluir esta narrativa?',
    categorySelect: 'Selecione uma categoria',
    tagSelect: 'Selecione tags',
  },
};

const useLocale = () => {
  const { locale } = useRouter();
  return translations[locale];
};

export default useLocale;
