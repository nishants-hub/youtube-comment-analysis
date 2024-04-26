# Video Insights Through Comment Analysis

> A chrome extension for saving time on youtube by getting reviews based on sentiment analysis

**Features:** 

- Auto Fetch Videos
- Recommendations with pie chart based on comment analysis
- Individual Video Excel Report
- Interactive UI


## Installing

1. Check if your `Node.js` version is >= **14**.
2. Change or configurate the name of your extension on `src/manifest`.
3. Run `npm install` to install the dependencies.

## Developing

run the command

```shell
$ cd my-crx-app

$ npm run dev
```

### Chrome Extension Developer Mode

1. set your Chrome browser 'Developer mode' up
2. click 'Load unpacked', and select `youtube-comment-analysis/build` folder

### Nomal FrontEnd Developer Mode

1. access `http://http://localhost:5173`
2. when debugging popup page, open `http://http://localhost:5173/popup.html`
3. when debugging options page, open `http://http://localhost:5173/options.html`

## Packing

After the development of your extension run the command

```shell
$ npm run build
```

Now, the content of `build` folder will be the extension ready to be submitted to the Chrome Web Store. 
Just take a look at the [official guide](https://developer.chrome.com/webstore/publish) to more infos about publishing.

