import QRCode from "qrcode";

export interface UPITransactionParams {
  payeeVpa: string;        // Merchant UPI ID, e.g. "easyva@upi"
  payeeName: string;       // Merchant Name, e.g. "Easyva Artisan Crafts"
  amount: number;          // e.g. 1499.00
  orderNumber: string;     // e.g. "ORD-849204"
  note?: string;           // Note on transfer
}

/**
 * Builds the standard NPCI UPI URI scheme for zero-commission direct bank-to-bank settlement.
 */
export function buildUpiUri(params: UPITransactionParams): string {
  const note = params.note || `Payment for Easyva Order #${params.orderNumber}`;
  const encodedName = encodeURIComponent(params.payeeName.trim());
  const encodedNote = encodeURIComponent(note.trim());
  const formattedAmount = params.amount.toFixed(2);

  // Standard NPCI URI specification
  return `upi://pay?pa=${params.payeeVpa.trim()}&pn=${encodedName}&am=${formattedAmount}&cu=INR&tn=${encodedNote}`;
}

/**
 * Generates an SVG Data URL QR Code representing the dynamic UPI payload.
 */
export async function generateUpiQrDataUrl(params: UPITransactionParams): Promise<string> {
  const upiUri = buildUpiUri(params);
  return QRCode.toDataURL(upiUri, {
    errorCorrectionLevel: "M",
    margin: 2,
    scale: 8,
    color: {
      dark: "#0F172A",
      light: "#FFFFFF",
    },
  });
}

/**
 * Deep links for installed mobile UPI applications.
 */
export function getUpiAppLinks(upiUri: string) {
  return [
    {
      name: "Google Pay",
      intentUri: upiUri,
      bgColor: "#FFFFFF",
      textColor: "#0F172A",
      borderColor: "#CBD5E1",
      badge: "GPay",
      accent: "#2563EB",
      iconColor: "#2563EB",
    },
    {
      name: "PhonePe",
      intentUri: upiUri,
      bgColor: "#5F259F",
      textColor: "#FFFFFF",
      borderColor: "#4C1D95",
      badge: "PhonePe",
      accent: "#A855F7",
      iconColor: "#FFFFFF",
    },
    {
      name: "Paytm",
      intentUri: upiUri,
      bgColor: "#002970",
      textColor: "#FFFFFF",
      borderColor: "#001B44",
      badge: "Paytm",
      accent: "#00BAF2",
      iconColor: "#00BAF2",
    },
    {
      name: "BHIM / Any UPI",
      intentUri: upiUri,
      bgColor: "#7C3AED",
      textColor: "#FFFFFF",
      borderColor: "#6D28D9",
      badge: "BHIM",
      accent: "#F59E0B",
      iconColor: "#F59E0B",
    },
  ];
}

