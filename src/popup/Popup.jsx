import './Popup.css'

import { PieChart, pieChartDefaultProps } from 'react-minimal-pie-chart'
import { useEffect, useState } from 'react'

import GradientPieChart from './GradientPieChart'
import useHelper from './useHelper'

export const Popup = () => {
  const [videos, setVideos] = useState([])
  const { fetchComments } = useHelper()
  const [analysedVideos, setAnalysedVideos] = useState([])

  // useEffect(() => {
  //   chrome.storage.sync.get(['videos'], (result) => {
  //     console.log(result)
  //     setVideos(result.videos || 0)
  //   })
  // }, [])

  const fetch = async () => {
    const res = await fetchComments(videos)
    console.log('result--->', res)
    setAnalysedVideos(res)
  }

  function getThumbnailUrl(videoId) {
    // Construct the thumbnail URL using the video ID
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  }

  useEffect(() => {
    // chrome.storage.sync.set({ videos })
    // chrome.runtime.sendMessage({ type: 'VIDEO_IDS', videos })
    const res = fetch()
  }, [videos])

  const fetchVideos = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'fetchVideos' }, (response) => {
        if (response && response.videos) {
          setVideos(response.videos)
        } else {
          console.error('Failed to fetch video IDs.')
        }
      })
    })
  }

  return (
    <main>
      <h3>YOUTUBE COMMENT ANALYSIS</h3>

      {analysedVideos.length === 0 && (
        <button onClick={fetchVideos} className="analysisbutton">
          Get Analysis
        </button>
      )}
      <div style={{ height: '700px', overflow: 'auto', display: 'flex', gap: '20px' }}>
        {analysedVideos &&
          analysedVideos?.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
              <div className="videoImage">
                <img src={getThumbnailUrl(item.video.id)} />
              </div>
              <div className="flex-col">
                <div>
                  <p>{item.video.title}</p>
                </div>
                <div style={{ height: '200px', width: '200px' }}>
                  <GradientPieChart
                    data={[
                      {
                        title: 'Positive',
                        value: item.analysis.positive,
                        color: 'url(#gradient1)',
                      },
                      { title: 'Neutral', value: item.analysis.neutral, color: 'url(#gradient2)' },
                      {
                        title: 'Negative',
                        value: item.analysis.negative,
                        color: 'url(#gradient3)',
                      },
                    ]}
                    label={({ dataEntry }) => dataEntry.value}
                    labelStyle={{ fontSize: '10px' }}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </main>
  )
}

export default Popup
