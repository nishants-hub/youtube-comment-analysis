import { useState } from 'react'
import vader from 'vader-sentiment'

const useHelper = () => {
  const apiKey = 'AIzaSyAf15KLtQI6qgZE9h4bvg2scRoQzh4bXOE'

  async function fetchCommentsHelper(videoId) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}`,
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`Error fetching comments for video ${videoId}:`, error)
    }
  }

  const getCategory = (compound) => {
    if (compound >= 0.5) {
      return 'positive'
    } else if (compound > -0.5) {
      return 'neutral'
    } else {
      return 'negative'
    }
  }

  const getAnalysis = (arr) => {
    const categoryCounts = arr.reduce(
      (counts, comment) => {
        const category = comment.category
        counts[category] = (counts[category] || 0) + 1
        return counts
      },
      { positive: 0, neutral: 0, negative: 0 },
    )
    return categoryCounts
  }

  const fetchComments = async (videos) => {
    const promises = videos.map(async (video) => {
      const response = await fetchCommentsHelper(video.id)
      if (response) {
        if (!response?.error) {
          let comments = []
          for (const item of response.items) {
            let intensity = vader.SentimentIntensityAnalyzer.polarity_scores(
              item.snippet.topLevelComment.snippet.textOriginal,
            )
            comments.push({
              text: item.snippet.topLevelComment.snippet.textOriginal,
              likes: item.snippet.topLevelComment.snippet.likeCount,
              intensity,
              category: getCategory(intensity.compound),
            })
          }
          return {
            video,
            comments,
          }
        }
      } else {
        return null
      }
    })
    const res = await Promise.all(promises)
    const filtered = res.filter((item) => item)
    return filtered.map((video) => ({ ...video, analysis: getAnalysis(video.comments) }))
  }

  return { fetchComments }
}

export default useHelper
