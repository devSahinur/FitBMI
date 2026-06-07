// SDK 54 moved the classic file API to the /legacy entrypoint.
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import type { BMIRecord } from '@/types';
import { historyToCSV } from '@/utils/csv';
import { CATEGORY_META, DISCLAIMER } from '@/constants';

async function writeAndShare(
  filename: string,
  contents: string,
  mimeType: string,
  dialogTitle: string,
): Promise<void> {
  const uri = `${FileSystem.cacheDirectory}${filename}`;
  await FileSystem.writeAsStringAsync(uri, contents, {
    encoding: FileSystem.EncodingType.UTF8,
  });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType, dialogTitle, UTI: 'public.item' });
  }
}

class ExportServiceImpl {
  async exportCSV(records: BMIRecord[]): Promise<void> {
    const csv = historyToCSV(records);
    await writeAndShare(
      'fitbmi-history.csv',
      csv,
      'text/csv',
      'Export BMI history',
    );
  }

  /**
   * Export a printable HTML report. (For true PDF, add expo-print and call
   * Print.printToFileAsync(html); HTML keeps the dependency footprint small.)
   */
  async exportReport(records: BMIRecord[]): Promise<void> {
    const rows = records
      .map(
        (r) => `<tr>
          <td>${new Date(r.createdAt).toLocaleDateString()}</td>
          <td>${r.bmi}</td>
          <td>${CATEGORY_META[r.category].label}</td>
          <td>${r.weightKg} kg</td>
        </tr>`,
      )
      .join('');

    const html = `<!doctype html><html><head><meta charset="utf-8"/>
      <style>
        body{font-family:-apple-system,Roboto,sans-serif;color:#111827;padding:24px}
        h1{color:#00C897}
        table{width:100%;border-collapse:collapse;margin-top:16px}
        th,td{border-bottom:1px solid #eee;padding:8px;text-align:left}
        .note{margin-top:24px;color:#6B7280;font-size:12px}
      </style></head><body>
      <h1>FitBMI Report</h1>
      <p>Generated ${new Date().toLocaleString()}</p>
      <table><thead><tr><th>Date</th><th>BMI</th><th>Category</th><th>Weight</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <p class="note">${DISCLAIMER}</p>
      </body></html>`;

    await writeAndShare(
      'fitbmi-report.html',
      html,
      'text/html',
      'Share BMI report',
    );
  }

  async shareText(text: string): Promise<void> {
    await writeAndShare(
      'fitbmi-result.txt',
      text,
      'text/plain',
      'Share result',
    );
  }
}

export const ExportService = new ExportServiceImpl();
