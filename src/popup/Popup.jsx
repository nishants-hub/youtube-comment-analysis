import './Popup.css'

import { useEffect, useState } from 'react'

import { FaDownload } from 'react-icons/fa'
import GradientPieChart from './GradientPieChart'
import Legend from './Legend'
import { Vortex } from 'react-loader-spinner'
import { delay } from './helperFunction'
import useHelper from './useHelper'

export const Popup = () => {
  const [videos, setVideos] = useState([])
  const { fetchComments } = useHelper()
  const [analysedVideos, setAnalysedVideos] = useState([])
  const [isPending, setIsPending] = useState(false)

  // useEffect(() => {
  //   chrome.storage.sync.get(['videos'], (result) => {
  //     console.log(result)
  //     setVideos(result.videos || 0)
  //   })
  // }, [])

  const fetch = async () => {
    setIsPending(true)
    await delay(10000)
    const res = await fetchComments(videos)
    console.log('result--->', res)
    setAnalysedVideos(res)
    setIsPending(false)
  }

  function getThumbnailUrl(videoId) {
    // Construct the thumbnail URL using the video ID
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  }

  useEffect(() => {
    // chrome.storage.sync.set({ videos })
    // chrome.runtime.sendMessage({ type: 'VIDEO_IDS', videos })
    if (videos && videos.length > 0) {
      fetch()
    }
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

  const playVideo = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')
  }

  function removeNonAlphanumeric(sentence) {
    // Use a regular expression to remove non-alphabetical and non-numerical characters
    return sentence.replace(/[^a-zA-Z0-9 ]/g, '')
  }

  const getJSONData = (index) => {
    let vidData = analysedVideos[index]
    let videoDataCSV = vidData?.comments?.map((item) => ({
      comment: removeNonAlphanumeric(item.text),
      category: item.category,
      positiveScore: item.intensity.pos,
      neutralScore: item.intensity.neu,
      negativeScore: item.intensity.neg,
      compoundScore: item.intensity.compound,
    }))

    videoDataCSV = videoDataCSV?.filter((item) =>
      ['neutral', 'positive', 'negative'].includes(item?.category),
    )

    console.log('csv', videoDataCSV)
    return videoDataCSV
  }

  const convertJsonToCsv = (index) => {
    // Convert JSON to CSV
    const csv = convertArrayToCSV(getJSONData(index))

    // Create a Blob containing the CSV data
    const blob = new Blob([csv], { type: 'text/csv' })

    // Create a download link
    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = 'data.csv'
    downloadLink.click()
  }

  const convertArrayToCSV = (array) => {
    const header = Object.keys(array[0]).join(',') + '\n'

    const body = array
      .map((obj) => {
        return Object.values(obj).join(',')
      })
      .join('\n')

    return header + body
  }

  return (
    <main>
      <h3>VIDEO INSIGHTS THROUGH COMMENT ANALYSIS</h3>

      {analysedVideos.length === 0 && !isPending && (
        <>
          <button onClick={fetchVideos} className="analysisbutton">
            Start Analysis
          </button>
          <div
            style={{
              overflow: 'auto',
              display: 'flex',
              gap: '8px',
              color: '#fff',
              fontSize: '16px',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '420px',
              textAlign: 'center',
              margin: 'auto',
              marginTop: '80px',
              backgroundColor: '#242424',
              borderRadius: '8px',
              padding: '20px',
            }}
          >
            <p style={{ marginBottom: '10px' }}>
              This extension is a part of our major project titled:
              <br></br>
              <span style={{ color: 'violet', textTransform: 'uppercase', fontSize: '18px' }}>
                Video Insights through comment analysis
              </span>
            </p>
            <p>Created by:</p>
            <p style={{ fontSize: '16px', marginTop: '4px' }}>Rishu Tiwari</p>
            <p style={{ fontSize: '16px' }}>Nishant Singh</p>
            <p style={{ fontSize: '16px' }}>Akash Rai</p>
          </div>
        </>
      )}
      <div
        style={{
          overflow: 'auto',
          display: 'flex',
          gap: '20px',
        }}
      >
        {isPending && (
          <div
            style={{
              width: '750px',
              height: '400px',
              alignSelf: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Vortex
              visible={true}
              height="80"
              width="80"
              ariaLabel="vortex-loading"
              wrapperStyle={{}}
              wrapperClass="vortex-wrapper"
              colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
            />
            <p className="waitmsg">Please Wait while we are doing analysis...</p>
          </div>
        )}
        {analysedVideos &&
          analysedVideos?.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '20px',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div style={{ minHeight: '50px', maxHeight: '50px' }}>
                  {index === 0 ? <p className="tag">⭐ Highest Rated</p> : null}
                  {index > 0 && index < 4 ? (
                    <p className="tag" style={{ backgroundColor: '#aa2d57' }}>
                      Recommended {index}
                    </p>
                  ) : null}
                </div>
                <div className="videoImage" onClick={() => playVideo(item.video.id)}>
                  <img src={getThumbnailUrl(item.video.id)} />
                </div>
                <div className="flex-col">
                  <div className="title">
                    <p>{item.video.title}</p>
                  </div>
                  <div style={{ height: '200px', width: '200px' }}>
                    <GradientPieChart
                      data={[
                        {
                          title: 'Positive',
                          value: item.percentage.positive,
                          color: 'url(#gradient1)',
                        },
                        {
                          title: 'Neutral',
                          value: item.percentage.neutral,
                          color: 'url(#gradient2)',
                        },
                        {
                          title: 'Negative',
                          value: item.percentage.negative,
                          color: 'url(#gradient3)',
                        },
                      ]}
                      label={({ dataEntry }) => dataEntry.value}
                      labelStyle={{ fontSize: '10px' }}
                    />
                  </div>
                  <div className="legendContainer">
                    <Legend
                      color={'#82ca26'}
                      title={'Positive'}
                      percentage={item.percentage.positive}
                    />
                    <Legend
                      color={'#1fa5ff'}
                      title={'Neutral'}
                      percentage={item.percentage.neutral}
                    />
                    <Legend
                      color={'#d55438'}
                      title={'Negative'}
                      percentage={item.percentage.negative}
                    />
                  </div>
                  <div className="downloadBtContainer">
                    <button className="downloadbutton" onClick={() => convertJsonToCsv(index)}>
                      <FaDownload size={'16px'} />
                      <span>Download Report</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </main>
  )
}

export default Popup
