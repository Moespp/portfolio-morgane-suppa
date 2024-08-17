import { useState } from "react";
import PDF from "react-pdf-js";

interface PdfViewerProps {
  fileUrl: string;
}

const PdfViewer = ({ fileUrl }: PdfViewerProps) => {
  const [page, setPage] = useState(1);

  return (
    <div className="pdf-viewer">
      <PDF file={fileUrl} page={page} />
    </div>
  );
};

export default PdfViewer;
