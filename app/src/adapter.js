const IMAGES_KEY = 'images';

export const getImageSources = () => {
  try {
    const result = JSON.parse(localStorage.getItem(IMAGES_KEY) || '[]');
    return result;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export const updateImageSources = (imageSources) => {
  localStorage.setItem(IMAGES_KEY, JSON.stringify(imageSources));
}
