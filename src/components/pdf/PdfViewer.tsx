import { useState, useEffect } from "react";
import PDF from "react-pdf-js";

interface PdfViewerProps {
  fileUrl: string;
  showPagination?: boolean;
}

const PdfViewer = ({ fileUrl, showPagination = true }: PdfViewerProps) => {
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1);

  const onDocumentComplete = (numPages: number) => {
    setNumPages(numPages);
    setPage(1);
  };

  const updateScale = () => {
    const width = window.innerWidth;
    if (width <= 480) {
      setScale(0.5);
    } else if (width <= 768) {
      setScale(0.8);
    } else {
      setScale(1);
    }
  };

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const goToPreviousPage = () =>
    setPage((prevPage) => Math.max(prevPage - 1, 1));

  const goToNextPage = () =>
    setPage((prevPage) => {
      if (numPages) return Math.min(prevPage + 1, numPages);
      return prevPage;
    });

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-screen-md">
        <PDF
          file={fileUrl}
          page={page}
          scale={scale}
          onDocumentComplete={onDocumentComplete}
        />
      </div>

      {showPagination && numPages && (
        <div className="mt-4 flex space-x-4 items-center">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            disabled={page <= 1}
            onClick={goToPreviousPage}
          >
            Précédente
          </button>
          <span className="text-gray-700">
            Page {page} sur {numPages}
          </span>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            disabled={page >= numPages}
            onClick={goToNextPage}
          >
            Suivante
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
