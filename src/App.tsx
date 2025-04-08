import './App.scss'
import {useEffect, useState} from "react";

const fetchCat = async (): Promise<ICatPhoto[] | null> => {
  try {
    const res = await fetch('https://api.thecatapi.com/v1/images/search');
    const data: ICatPhoto[] = await res.json();
    return data;
  } catch (error) {
    console.log(error)
    return null;
  }
}

function App() {
  const [image, setImage] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  const getCat = async () => {
    setLoading(true);
    const data = await fetchCat();
    setLoading(false);
    if (data && data.length > 0) {
      setImage(data[0].url);
    }
  };

  useEffect(() => {
    getCat();
  }, [])

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      getCat();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <main className='main'>
      <label className='checkbox-wrapper'>
        <input type='checkbox' checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        Enabled
      </label>

      <label className='checkbox-wrapper'>
        <input type='checkbox' checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
        Auto-refresh every 5 seconds
      </label>

      <button className='get-cat-btn' disabled={!enabled} onClick={getCat}>
        Get cat
      </button>

      {loading && <p>Loading...</p>}

      {!loading && <img src={image} alt=""/>}
    </main>
  )
}

export default App
