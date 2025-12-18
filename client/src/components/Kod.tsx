import { Sandpack } from "@codesandbox/sandpack-react";

interface KodEditoruProps {
  kod: string;
}

const KodEditoru = ({ kod }: KodEditoruProps) => {

  if (!kod || kod.length < 5) return null;


  const indexHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>`;

 
  const indexCSS = `
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: white;
      color: black;
    }
    * {
      box-sizing: border-box;
    }
  `;


  const mainTSX = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // Artık bu dosya var olduğu için hata vermeyecek!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
`;

  return (
    <div className="my-8 w-full max-w-[90vw] md:max-w-full mx-auto shadow-2xl rounded-xl overflow-hidden border border-gray-200">
      <div className="bg-gray-900 text-white px-4 py-2 text-sm font-semibold flex items-center justify-between">
        <span>🚀 İnteraktif Kod Alanı</span>
        <span className="text-xs text-gray-400">Kodu düzenleyebilirsin!</span>
      </div>
      
      <Sandpack 
        key={kod} 
        template="vite-react"
        theme="dark"
        
        files={{
          "/index.html": indexHTML,
          "/main.tsx": mainTSX,
          "/index.css": indexCSS, 
          "/App.tsx": kod, 
        }}
        
        options={{
          showNavigator: true, 
          showLineNumbers: true, 
          editorHeight: 400, 
          showTabs: false,
          activeFile: "/App.tsx",
        }}
      />
    </div>
  );
};

export default KodEditoru;