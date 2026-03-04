// PDFViewer.jsx
import { useEffect, useRef } from "react";
// import { getDocument, GlobalWorkerOptions, version } from "pdfjs-dist";

export default function PDFViewer({ url }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const renderPDF = async () => {
      try {
        const loadingTask = getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Set canvas size and background color
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        context.fillStyle = "#f5f5f5"; // Background color
        context.fillRect(0, 0, canvas.width, canvas.height);

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (error) {
        console.error("PDF render error:", error);
      }
    };

    renderPDF();
  }, [url]);

  return <canvas ref={canvasRef} style={{ borderRadius: "8px" }} />;
}
