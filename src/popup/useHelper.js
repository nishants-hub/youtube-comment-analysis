import { useState } from 'react'
import vader from 'vader-sentiment'

const useHelper = () => {
  const apiKey = 'AIzaSyAf15KLtQI6qgZE9h4bvg2scRoQzh4bXOE'
  const maxResults = 100

  // comments fetch for each video
  async function fetchCommentsHelper(videoId) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}&maxResults=${maxResults}`,
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`Error fetching comments for video ${videoId}:`, error)
    }
  }

  const getCategory = (compound) => {
    if (compound >= 0.05) {
      return 'positive'
    } else if (compound > -0.05) {
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
    const filtered = res.filter((item) => item && item.comments && item.comments.length > 50)
    const output = filtered.map((video) => ({ ...video, analysis: getAnalysis(video.comments) }))
    const finaloutput = output.map((item) => ({
      ...item,
      percentage: {
        positive:
          (item.analysis.positive /
            (item.analysis.positive + item.analysis.neutral + item.analysis.negative)) *
          100,
        neutral:
          (item.analysis.neutral /
            (item.analysis.positive + item.analysis.neutral + item.analysis.negative)) *
          100,
        negative:
          (item.analysis.negative /
            (item.analysis.positive + item.analysis.neutral + item.analysis.negative)) *
          100,
      },
    }))
    return finaloutput.sort(
      (a, b) =>
        b.percentage.positive -
        b.percentage.negative -
        (a.percentage.positive - a.percentage.negative),
    )
  }

  return { fetchComments }
}

export default useHelper
