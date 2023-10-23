import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import "./App.css";
import Container from "./Container";
import { getImageSources, updateImageSources } from "./adapter";

const imageTypeRegex = /image\/(png|jpg|jpeg)/gm;
const imageSourceStorageLimit = 25;

function App() {
  const [imageFiles, setImageFiles] = useState([]);
  const [imageSources, setImageSources] = useState([]);

  const fileChangeHandler = ({ target: { files }}) => {
    const validImgFiles = [...files].filter(({ type }) => type.match(imageTypeRegex));
    if (validImgFiles.length + imageSources.length > imageSourceStorageLimit) return alert("That's too many images!");
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
      .then(imgSources => {
        const newImageSources = imgSources.map(imgSrc => ({ uuid: uuidv4(), imgSrc }));
        setImageSources((prevImgSources) => [...newImageSources, ...prevImgSources])
      })
      .catch(console.error);
  }, [imageFiles]);

  useEffect(() => {
    if (!imageSources.length) return;
    updateImageSources(imageSources);
  }, [imageSources]);

  useEffect(() => {
    setImageSources(getImageSources());
  }, []);

  return (
    <>
      <header>
        <p id="logo">InstaPreview</p>
      </header>
      <main>
        <form aria-labelledby="form-heading">
          <h2 id="form-heading">Add Your Previews!</h2>
          <p>Remember, you have a maximum of {imageSourceStorageLimit}.</p>
          <p>(You have {imageSourceStorageLimit - imageSources.length} left)</p>
          <label htmlFor="file" className="custom-file-upload" >Upload images: </label>
          <input
            type="file"
            id="file"
            onChange={fileChangeHandler}
            accept="image/png, image/jpg, image/jpeg"
            multiple
          />
          <p>Heads up: when moving images around, click in the middle of the picture for best dragging results</p>
        </form>
        <Container imageSources={imageSources} setImageSources={setImageSources}/>
      </main>
    </>
  );
}

export default App;