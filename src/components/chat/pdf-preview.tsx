'use client';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { useRef, useState, type RefObject } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useDebounceCallback, useResizeObserver } from 'usehooks-ts';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
  wasmUrl: '/wasm/',
};

const maxWidth = 800;

export default function PdfPreview({ fileUrl }: { fileUrl: string }) {
  const [containerWidth, setContainerWidth] = useState<number>();
  const [numPages, setNumPages] = useState<number>();

  const containerRef = useRef<HTMLDivElement>(null);

  const onResize = useDebounceCallback(setContainerWidth, 100);

  useResizeObserver({
    ref: containerRef as RefObject<HTMLElement>,
    onResize: ({ width }) => onResize(width),
  });

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div ref={containerRef} className="h-full w-full overflow-y-auto">
      <Document
        file={fileUrl}
        options={options}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div>Loading...</div>}
      >
        {Array.from(new Array(numPages), (_el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={
              containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
            }
          />
        ))}
      </Document>
    </div>
  );
}
