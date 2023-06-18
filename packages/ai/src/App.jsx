// import { useState } from 'react'
import './App.css';
import { MessageList } from "./MessageList";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className="overflow-hidden w-full h-full relative flex z-0">
      <div className="relative flex h-full max-w-full flex-1 overflow-hidden">
        <div className="flex h-full max-w-full flex-1 flex-col">
          <main className="relative h-full w-full transition-width flex flex-col overflow-auto items-stretch flex-1">
            <div className="flex-1 overflow-hidden" style={{ overflowY: "auto" }}>
              <div className="flex flex-col text-sm">
                
                <div className="flex items-center justify-center gap-1 border-b border-black/10 bg-gray-50 p-3 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className="h-4 w-4" width="16" height="16" strokeWidth="2"><path d="M9.586 1.526A.6.6 0 0 0 8.553 1l-6.8 7.6a.6.6 0 0 0 .447 1h5.258l-1.044 4.874A.6.6 0 0 0 7.447 15l6.8-7.6a.6.6 0 0 0-.447-1H8.542l1.044-4.874Z" fill="currentColor"></path></svg>Model: Default (GPT-3.5)
                </div>

                <MessageList />

                <div id="message-list-bottom" className="h-32 md:h-48 flex-shrink-0"></div>

              </div>
            </div>

            <div
              className="absolute bottom-0 left-0 w-full border-t md:border-t-0 md:border-transparent md: md:bg-vert-light-gradient bg-white md:!bg-transparent pt-2 md:-left-2">
              <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
                <div className="relative flex h-full flex-1 items-stretch md:flex-col" role="presentation">
                  <div
                    className="flex flex-col w-full py-[10px] flex-grow md:py-4 md:pl-4 relative border border-black/10 bg-white rounded-xl shadow-xs">
                    <textarea id="prompt-textarea" tabIndex="0" rows="1"
                      placeholder="Send a message."
                      className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-10 focus:ring-0 focus-visible:ring-0 md:pr-12 pl-3 md:pl-0"
                      style={{"maxHeight":"200px","height":"24px","overflowY":"hidden"}}></textarea>
                    <button disabled
                      className="absolute p-1 rounded-md md:bottom-3 md:p-2 md:right-3 right-2 disabled:text-gray-400 enabled:bg-brand-purple text-white bottom-1.5 transition-colors disabled:opacity-40"><span
                        className="" data-state="closed"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none"
                          className="h-4 w-4 m-1 md:m-0" strokeWidth="2">
                          <path
                            d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
                            fill="currentColor"></path>
                        </svg></span>
                    </button></div>
                </div>
              </form>
              <div className="px-3 pb-3 pt-2 text-center text-xs text-gray-600 md:px-4 md:pb-6 md:pt-3"><span>ChatGPT
                  may produce inaccurate information about people, places, or facts. <a
                    href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes" target="_blank" rel="noreferrer"
                    className="underline">ChatGPT May 24 Version</a></span></div>
            </div>

          </main>
        </div>
      </div>
    </div>
  )
}

export default App
