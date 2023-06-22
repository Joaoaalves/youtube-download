import React from 'react'
import axios from 'axios'
import fileDownload from 'react-file-download'
import { ImSpinner9 } from 'react-icons/im'

const VideoWrapper = ({downloadId, thumbnail, duration, title, status, progress}) => {
  
  const handleDownload = () => {
    console.log(downloadId)
    axios.get(`http://localhost:8080/api/download?id=${downloadId}`, {
      responseType: 'blob'
    })
      .then(res => {
        var audio = new Blob([res.data], { type: 'audio/mp3' })
        fileDownload(audio, `${title}.mp3`)

      })
  }

  function toHoursAndMinutes(totalSeconds) {
    const totalMinutes = Math.floor(totalSeconds / 60);
  
    const seconds = totalSeconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  function pad(number) {
    return number < 10 ? '0' + number : number;
  }

  return (
    
    <div className='flex gap-x-4 w-full items-center justify-center'>
        <img src={thumbnail} alt='thumbnail' width={'320px'}/>
        <div className='flex flex-col items-start justify-items-start p-2 h-full gap-4'>
          <h3>Title: <b>{title}</b></h3>
          <p>Duration: <b>{toHoursAndMinutes(duration)}</b></p>
          <p>Percentage: {progress}</p>
          <button onClick={handleDownload} 
            className='bg-green-500 px-4 py-2 rounded-lg mt-auto disabled:bg-gray-600 flex items-center justify-center' disabled={status === 'waiting'}>
            {status === 'waiting' ? <ImSpinner9 className='animate-spin inline mr-4' /> : null}
            Download
          </button>

          
        </div>
    </div>
  )
}

export default VideoWrapper