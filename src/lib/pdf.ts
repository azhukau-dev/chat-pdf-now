import { pdfjs } from 'react-pdf';

export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';
    const numPages = pdf.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // combines text items with proper spacing and line breaks
      const pageText = textContent.items
        .map((item) => {
          // checks if the item contains actual text
          if ('str' in item) {
            // adds a newline character if the text item indicates an end-of-line
            return item.str + (item.hasEOL ? '\n' : '');
          }
          return '';
        })
        // removes any empty strings
        .filter(Boolean)
        // combines all text pieces with spaces between them
        .join(' ')
        // cleans up formatting by replacing multiple whitespace characters followed by a newline with just a single newline
        .replace(/\s+\n/g, '\n');

      // add a new line between pages
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (error) {
    throw new Error(
      'Failed to extract text from PDF. The file may be corrupted or password protected.',
    );
  }
}
