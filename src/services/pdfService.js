import { usePDF } from 'react-to-pdf';

export const useFinancialPDF = () => {
  return usePDF({
    filename: 'financial-analysis.pdf',
    page: {
      margin: 10,
      format: 'A4'
    }
  });
};