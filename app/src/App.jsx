import { useState } from 'react'
import './App.css'
import { validYoutubeUrl } from './utils/regex'
import VideoWrapper from './components/VideoWrapper'
import { FaExchangeAlt } from 'react-icons/fa'

function App() {
  const [url, setUrl] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState('')
  const [downloadId, setDownloadId] = useState(false)
  const [status, setStatus] = useState(false)
  const [progress, setProgress] = useState(0)


  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validYoutubeUrl.test(url)) {
      alert('Please enter a valid Youtube URL')
      setLoading(false)
      return
    }

    fetch('http://localhost:8080/api/youtubeDownload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url })
      })
      .then(res => {
        const reader = res.body.getReader();
        readStream(reader);
      })
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  async function readStream(reader){
    while(true){
      sleep(1000)
      const {done, value} = await reader.read();
      if(done){
        break;
      }
      
      try{
        const data = JSON.parse(new TextDecoder().decode(value));
        const { id, title, thumbnail, duration, status, progressPercentage  } = data

        if(status && status == 'waiting'){
          setDownloadId(id)
          setTitle(title)
          setThumbnail(thumbnail)
          setDuration(duration)
          setStatus(status)
        }
        
        if(progressPercentage){
          setProgress(progressPercentage.trim())
        }
      }
      catch(err){
        console.log(err);
      }

    }
  }

  return (
    <>
      <div className="App">
          {thumbnail ? VideoWrapper({ downloadId, thumbnail, title, duration, status, progress })
            :
            <>
              <h1 className="text-5xl font-bold text-green-500 text-center mt-32">Youtube Downloader</h1>
              <form
                className="flex gap-x-4 w-full items-center justify-center py-32 px-32 overflow-hidden"
              >
                <input type="text" placeholder="Enter URL" onChange={(e) => setUrl(e.target.value)}
                  className='text-white bg-transparent border-green-500 border-[1px] p-2 rounded-lg w-full outline-none text-center'
                />

                <button onClick={handleSubmit}
                  className='absolute right-32 p-2 w-28 text-green-500 border-l-[1px] border-l-green-500 rounded-r-lg hover:text-white hover:bg-green-500'>
                  <FaExchangeAlt className="inline" />
                </button>
              </form>
            </>
        }
      </div>

    </>
  )
}

export default App
