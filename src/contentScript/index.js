console.info('contentScript is running')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchVideos') {
    const videos = Array.from(document.querySelectorAll('a#video-title'))
      .map((a) => {
        const urlParams = new URLSearchParams(new URL(a.href).search)
        const title = a.title
        return { id: urlParams.get('v'), title }
      })
      .filter((item) => item.id && item.title) // Remove null values

    // Send the extracted video IDs back to the extension
    sendResponse({ videos })
  }
})
