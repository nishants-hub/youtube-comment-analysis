import { useState, useEffect } from 'react'

import './Popup.css'

export const Popup = () => {
  const [videoIds, setVideoIds] = useState([])

  useEffect(() => {
    chrome.storage.sync.get(['videoIds'], (result) => {
      console.log(result)
      setVideoIds(result.videoIds || 0)
    })
  }, [])

  useEffect(() => {
    chrome.storage.sync.set({ videoIds })
    chrome.runtime.sendMessage({ type: 'VIDEO_IDS', videoIds })
  }, [videoIds])

  const fetchVideoIds = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'fetchVideoIds' }, (response) => {
        if (response && response.videoIds) {
          setVideoIds(response.videoIds)
        } else {
          console.error('Failed to fetch video IDs.')
        }
      })
    })
  }

  return (
    <main>
      <h3>Popup Page</h3>
      <button onClick={fetchVideoIds}>Fetch Video IDs</button>
      <div>
        {videoIds.length > 0 ? (
          <ul>
            {videoIds.map((id, index) => (
              <li key={index}>{id}</li>
            ))}
          </ul>
        ) : (
          <p>No video IDs found.</p>
        )}
      </div>
    </main>
  )
}

export default Popup
