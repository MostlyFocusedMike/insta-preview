import { useEffect, useState } from "react";
import "./App.css";
import Container from "./Container";

const imageTypeRegex = /image\/(png|jpg|jpeg)/gm;
const imageSourceStorageLimit = 25;

function App() {
  const [imageFiles, setImageFiles] = useState([]);
  const [imageSources, setImageSources] = useState([]);

  const fileChangeHandler = ({ target: { files }}) => {
    const validImgFiles = [...files].filter(({ type }) => type.match(imageTypeRegex));
    validImgFiles.length ? setImageFiles(validImgFiles) : alert("Images aren't valid!");
  };

  useEffect(() => {
    if (!imageFiles.length) return;

    const promises = imageFiles.map(file => new Promise((res, rej) => {
      const fileReader = new FileReader();

      fileReader.onload = ({ target: { result } }) => (result && res(result));
      fileReader.onabort = () => rej(new Error("File reading aborted"));
      fileReader.onerror = () => rej(new Error("Failed to read file"));

      fileReader.readAsDataURL(file);
    }));

    Promise.all(promises)
      .then(imgSources => setImageSources((prevImgSources) => [...imgSources, ...prevImgSources]))
      .catch(console.error);
  }, [imageFiles]);

  useEffect(() => {
    if (!imageSources.length) return;
    localStorage.setItem('images', JSON.stringify(imageSources));
  }, [imageSources]);

  useEffect(() => {
    const result = JSON.parse(localStorage.getItem('images') || '[]');
    setImageSources(result);
  }, []);

  return (
    <>
      <header>
        <p id="logo">InstaPreview</p>
      </header>
      <main>
        <form aria-labelledby="form-heading">
          <h2 id="form-heading">Add your previews!</h2>
          <p>Remember, you have a maximum of {imageSourceStorageLimit}.</p>
          <p>(You have {imageSourceStorageLimit - imageSources.length} left)</p>
          <label htmlFor="file">Upload images</label>
          <input
            type="file"
            id="file"
            onChange={fileChangeHandler}
            accept="image/png, image/jpg, image/jpeg"
            multiple
            />
        </form>
        <Container imageSources={imageSources} setImageSources={setImageSources}/>
      </main>
    </>
  );
}

export default App;