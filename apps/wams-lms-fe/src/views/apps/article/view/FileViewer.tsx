import React, { useEffect, useState } from 'react';
import { ArticleTypeEnum } from "../../../../types/apps/articleTypes";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

interface FileViewerProps {
  fileUrl: string,
  fileExtension: string
}

const FileViewer = ({ fileUrl, fileExtension }: FileViewerProps) => {
  const [htmlString, setHtmlString] = useState("");
  const fileType = fileExtension as ArticleTypeEnum;

  useEffect(() => {
    if (fileType === "HTML") {
      fetch(fileUrl)
        .then(res => res.text())
        .then(text => {
          setHtmlString(text);
        });
    }
  }, [fileUrl, fileType]);

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#f5f5f5', borderRadius: '8px', overflow: 'hidden' }}>
      {fileType === 'PDF' && (
        <DocViewer
          key={Date.now()}
          pluginRenderers={DocViewerRenderers}
          documents={[
            {
              uri: fileUrl,
              fileType: fileExtension.toLowerCase()
            }
          ]}
          config={{
            header: {
              disableHeader: true,
              disableFileName: true,
              retainURLParams: false
            }
          }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        />
      )}
      {fileType === 'VIDEO' && (
        <video
          controls
          style={{
            maxWidth: '100%',
            width: '100%',
            height: 'auto',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          <source src={fileUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {fileType === 'HTML' && (
        <iframe
          srcDoc={htmlString}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '8px',
            overflow: 'auto',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
          sandbox="allow-scripts allow-same-origin"
        />
      )}

      {!fileUrl && <p style={{ color: 'red', textAlign: 'center', padding: '20px', fontWeight: 'bold' }}>Error: No file URL provided or file cannot be accessed.</p>}
    </div>
  );
};

export default FileViewer;
