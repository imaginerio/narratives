function validateYoutubeUrl(url) {
  const regExp =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return url.match(regExp);
}

function validateSoundcloudUrl(url) {
  const regExp = /^(https?:\/\/(soundcloud.com|snd\.sc)\/(.*))$/;
  return url.match(regExp);
}

function validateVimeoUrl(url) {
  const regExp =
    /^(?:https?:\/\/)?(?:www\.)?(vimeo\.com)\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
  return url.match(regExp);
}

const validateAll = url =>
  validateYoutubeUrl(url) || validateSoundcloudUrl(url) || validateVimeoUrl(url);

export default validateAll;
