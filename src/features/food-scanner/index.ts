/**
 * Food Scanner — ARCHITECTURE ONLY (disabled).
 *
 * Future feature for camera-based food recognition, calorie estimation and
 * barcode scanning. The interfaces below define the contract so UI and data
 * layers can be built against them; swap `disabledScanner` for a real
 * implementation (e.g. expo-camera + a vision API / Open Food Facts) later.
 */

export interface RecognizedFood {
  name: string;
  confidence: number; // 0..1
  caloriesPer100g: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
}

export interface ScanResult {
  source: 'camera' | 'upload' | 'barcode';
  items: RecognizedFood[];
  estimatedCalories: number;
  raw?: unknown;
}

export interface BarcodeProduct {
  barcode: string;
  name: string;
  brand?: string;
  caloriesPer100g?: number;
}

export interface FoodScannerService {
  readonly enabled: boolean;
  /** Recognise food from a captured/picked image URI. */
  recognizeImage(uri: string): Promise<ScanResult>;
  /** Estimate total calories for a set of recognised foods + grams. */
  estimateCalories(items: RecognizedFood[], grams: number[]): number;
  /** Look up a product by barcode (e.g. Open Food Facts). */
  scanBarcode(barcode: string): Promise<BarcodeProduct | null>;
}

const NOT_IMPLEMENTED = 'Food scanner is not enabled in this build.';

export const disabledScanner: FoodScannerService = {
  enabled: false,
  async recognizeImage() {
    throw new Error(NOT_IMPLEMENTED);
  },
  estimateCalories(items, grams) {
    return Math.round(
      items.reduce(
        (sum, item, i) => sum + (item.caloriesPer100g * (grams[i] ?? 0)) / 100,
        0,
      ),
    );
  },
  async scanBarcode() {
    return null;
  },
};

export const FoodScannerService = disabledScanner;
