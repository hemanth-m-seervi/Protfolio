import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function ResumePdf({ url }) {
  const containerRef = useRef(null);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(900);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const availableWidth = entry.contentRect.width - 32;

      setPageWidth(
        Math.min(Math.max(availableWidth, 280), 1000)
      );
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="resume-pdf-container"
    >
      <Document
  file={url}
  onLoadSuccess={({ numPages }) => {
    setNumberOfPages(numPages);
  }}
  onLoadError={(error) => {
    console.error("Resume PDF load error:", error);
  }}
  onSourceError={(error) => {
    console.error("Resume PDF source error:", error);
  }}
  loading={
    <div className="resume-pdf-message">
      Loading resume…
    </div>
  }
  error={
    <div className="resume-pdf-message">
      Unable to display the resume.
    </div>
  }
>
        {Array.from(
          { length: numberOfPages },
          (_, index) => (
            <Page
              key={index + 1}
              pageNumber={index + 1}
              width={pageWidth}
              renderTextLayer
              renderAnnotationLayer
              className="resume-pdf-page"
            />
          )
        )}
      </Document>
    </div>
  );
}