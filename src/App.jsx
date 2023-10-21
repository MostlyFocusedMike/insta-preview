import { useEffect, useState } from "react";
import "./App.css";

const imageTypeRegex = /image\/(png|jpg|jpeg)/gm;

function App() {
  const [imageFiles, setImageFiles] = useState([]);
  const [imageSources, setImageSources] = useState([]);

  const fileChangeHandler = ({ target: { files }}) => {
    const validImageFiles = [...files].filter(({ type }) => type.match(imageTypeRegex));
    validImageFiles.length
      ? setImageFiles([...validImageFiles, ...imageFiles])
      : alert("Images are not of valid!");
  };

  useEffect(() => {
    const fileReaders = [];
    let isCancel = false;

    if (!imageFiles.length) return;

    const promises = imageFiles.map(file => new Promise((res, rej) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);
      fileReader.onload = ({ target: { result } }) => result && res(result);
      fileReader.onabort = () => rej(new Error("File reading aborted"));
      fileReader.onerror = () => rej(new Error("Failed to read file"));

      fileReaders.push(fileReader);
    }));

    Promise.all(promises)
      .then(imageSources => !isCancel && setImageSources(imageSources))
      .catch(console.error);

    return () => {
      isCancel = true;
      fileReaders.forEach(({ readyState, abort }) => readyState === 1 && abort())
    }
  }, [imageFiles]);

  return (
    <div className="App">
      <form>
        <label htmlFor="file">Upload images</label>
        <input
          type="file"
          id="file"
          onChange={fileChangeHandler}
          accept="image/png, image/jpg, image/jpeg"
          multiple
        />
      </form>
      {
        imageSources.length
          ? <div>{imageSources.map((image) => <img key={image} src={image} alt="" />)}</div>
          : null
      }
    </div>
  );
}

export default App;