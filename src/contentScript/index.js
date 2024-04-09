console.info('contentScript is running')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchVideoIds') {
    const videoIds = Array.from(document.querySelectorAll('a#video-title'))
      .map((a) => {
        const urlParams = new URLSearchParams(new URL(a.href).search)
        return urlParams.get('v')
      })
      .filter((id) => id) // Remove null values

    // Send the extracted video IDs back to the extension
    sendResponse({ videoIds })
  }
})
