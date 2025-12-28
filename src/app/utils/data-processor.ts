import Papa from "papaparse";
import * as pdfjsLib from "pdfjs-dist";
import { createWorker } from "tesseract.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export interface Transaction {
  date: Date;
  type: "sent" | "received" | "withdrawn" | "deposited" | "airtime" | "other";
  amount: number;
  recipient?: string;
  sender?: string;
  category: string;
  balance: number;
  details: string;
}

export interface FinancialSummary {
  totalTransactions: number;
  totalSent: number;
  totalReceived: number;
  totalWithdrawn: number;
  netChange: number;
  largestTransaction: number;
  averageTransaction: number;
  monthlyData: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
  categoryBreakdown: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  topRecipients: Array<{
    name: string;
    amount: number;
    count: number;
  }>;
  spendingPersonality: string;
  highlights: string[];
  transactions: Transaction[];
}
function categorizeTransaction(details: string, type: string): string {
  const lower = details.toLowerCase();

  if (lower.includes("airtime") || lower.includes("bundle"))
    return "Airtime & Data";
  if (
    lower.includes("water") ||
    lower.includes("electricity") ||
    lower.includes("kplc") ||
    lower.includes("utility")
  )
    return "Utilities";
  if (
    lower.includes("supermarket") ||
    lower.includes("shop") ||
    lower.includes("store")
  )
    return "Shopping";
  if (
    lower.includes("restaurant") ||
    lower.includes("food") ||
    lower.includes("eat")
  )
    return "Food & Dining";
  if (
    lower.includes("transport") ||
    lower.includes("uber") ||
    lower.includes("taxi") ||
    lower.includes("matatu")
  )
    return "Transport";
  if (
    lower.includes("withdraw") ||
    lower.includes("atm") ||
    lower.includes("agent")
  )
    return "Cash Withdrawal";
  if (lower.includes("fee") || lower.includes("overdraft"))
    return "Fees & Charges";
  if (type === "received") return "Income";
  if (type === "sent") return "Transfers";
  return "Other";
}

function getSpendingPersonality(summary: FinancialSummary): string {
  const savingsRate =
    (summary.totalReceived - summary.totalSent) / summary.totalReceived;
  const avgTransaction = summary.averageTransaction;

  if (savingsRate > 0.3) return "💰 The Saver";
  if (savingsRate < -0.2) return "🎉 The Spender";
  if (avgTransaction > 5000) return "👑 The High Roller";
  if (summary.categoryBreakdown[0]?.name === "Shopping")
    return "🛍️ The Shopaholic";
  if (summary.categoryBreakdown[0]?.name === "Food & Dining")
    return "🍽️ The Foodie";
  return "⚖️ The Balanced";
}

function generateHighlights(summary: FinancialSummary): string[] {
  const highlights: string[] = [];

  highlights.push(
    `You made ${summary.totalTransactions.toLocaleString()} transactions this year`
  );

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const highestMonth = summary.monthlyData.reduce((max, month) =>
    month.expenses > max.expenses ? month : max
  );
  highlights.push(`${highestMonth.month} was your highest spending month`);

  if (summary.topRecipients.length > 0) {
    highlights.push(
      `You sent money to ${summary.topRecipients[0].name} ${summary.topRecipients[0].count} times`
    );
  }

  if (summary.netChange > 0) {
    highlights.push(
      `You saved KES ${summary.netChange.toLocaleString()} this year! 🎉`
    );
  } else {
    highlights.push(
      `You spent KES ${Math.abs(
        summary.netChange
      ).toLocaleString()} more than you received`
    );
  }

  const topCategory = summary.categoryBreakdown[0];
  if (topCategory) {
    highlights.push(
      `${topCategory.percentage}% of your spending went to ${topCategory.name}`
    );
  }

  return highlights;
}

export function parseMpesaCSV(csvContent: string): Promise<FinancialSummary> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const transactions: Transaction[] = results.data.map((row: any) => {
            const paidIn = parseFloat(row["Paid In"]?.replace(/,/g, "") || "0");
            const withdrawn = parseFloat(
              row["Withdrawn"]?.replace(/,/g, "") || "0"
            );
            const dateStr = (
              row["Completion Time"] ||
              row["Completed Time"] ||
              ""
            ).trim();
            const date = new Date(dateStr.replace(" ", "T"));

            let type: Transaction["type"] = "other";
            let amount = 0;

            if (paidIn > 0) {
              type = "received";
              amount = paidIn;
            } else if (withdrawn > 0) {
              type = "sent";
              amount = withdrawn;
            }

            const details = (
              row.Details ||
              row.Description ||
              ""
            ).toLowerCase();

            if (details.includes("airtime") || details.includes("buy bundles"))
              type = "airtime";
            if (details.includes("withdraw") || details.includes("agent"))
              type = "withdrawn";

            return {
              date,
              type,
              amount: Math.abs(amount),
              recipient:
                row.Recipient ||
                row["Initiator Name"] ||
                row["Other Party"] ||
                "Unknown",
              sender: row.Sender || row["Other Party"] || "Unknown",
              category: categorizeTransaction(row.Details || "", type),
              balance: parseFloat((row.Balance || "0").replace(/,/g, "")),
              details: row.Details || row.Description || "",
            };
          });

          const summary = processTransactions(transactions);
          resolve(summary);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => reject(error),
    });
  });
}

//mpesa pdf parse
export async function parseMpesaPDF(
  file: File | ArrayBuffer,
  password: string = "" // Default empty, pass one for PDFs
): Promise<FinancialSummary> {
  const arrayBuffer = file instanceof File ? await file.arrayBuffer() : file;

  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    password: password.trim(),
  });

  let pdf;
  try {
    pdf = await loadingTask.promise;
  } catch (err: any) {
    if (err.name === "PasswordException") {
      throw new Error(
        "Incorrect password. Try again with your National ID number or the 6-digit SMS code."
      );
    }
    throw err;
  }
  const worker = await createWorker("eng");
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);

    // Try native text extraction first (fast & accurate when available)
    const content = await page.getTextContent();
    let pageText = content.items
      .map((item: any) => item.str)
      .join(" ")
      .trim();

    // Fallback to OCR if no text (scanned/image-based page)
    if (!pageText || pageText.length < 50) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      const viewport = page.getViewport({ scale: 3.0 }); // Higher scale = better OCR
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;

      const { data } = await worker.recognize(canvas, {
        tessedit_pageseg_mode: "6", // Assume uniform block of text (better for tables)
        preserve_interword_spaces: "1",
      });
      pageText = data.text;
    }

    fullText += pageText + "\n";
  }

  await worker.terminate();

  const transactions: Transaction[] = [];

  // Much more flexible regex for real M-Pesa statements
  // Handles: variable spaces, optional "KSh", commas, decimals, OCR noise
  const transactionRegex =
    /^\s*(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+(.+?)\s+Completed\s+(KSh ?)?([\d,]+\.?\d*)\s+(KSh ?)?([\d,]+\.?\d*)\s+(KSh ?)?([\d,]+\.?\d*)\s*$/i;

  const lines = fullText.split("\n").map((l) => l.trim());

  for (const line of lines) {
    const match = line.match(transactionRegex);
    if (!match) continue;

    const [
      ,
      dateTimeStr,
      detailsRaw,
      ,
      paidInStr,
      ,
      withdrawnStr,
      ,
      balanceStr,
    ] = match;

    const date = new Date(dateTimeStr.replace(" ", "T"));
    if (isNaN(date.getTime())) continue; // Skip invalid dates

    const cleanAmount = (s: string) =>
      parseFloat(s.replace(/KSh|,/g, "").trim()) || 0;

    const paidIn = cleanAmount(paidInStr);
    const withdrawn = cleanAmount(withdrawnStr);
    const balance = cleanAmount(balanceStr);

    let type: Transaction["type"] = "other";
    let amount = 0;

    if (paidIn > 0) {
      type = "received";
      amount = paidIn;
    } else if (withdrawn > 0) {
      type = "sent";
      amount = withdrawn;
    }

    const detailsLower = detailsRaw.toLowerCase().trim();

    if (
      detailsLower.includes("airtime") ||
      detailsLower.includes("buy goods") ||
      detailsLower.includes("bundles")
    ) {
      type = "airtime";
    }
    if (detailsLower.includes("withdraw") || detailsLower.includes("agent")) {
      type = "withdrawn";
    }

    transactions.push({
      date,
      type,
      amount,
      recipient:
        detailsLower.includes("paybill") || detailsLower.includes("to ")
          ? detailsRaw.split(/to\s+/i)[1]?.trim() || "Unknown"
          : "Unknown",
      sender: "Unknown",
      category: categorizeTransaction(detailsRaw, type),
      balance,
      details: detailsRaw.trim(),
    });
  }

  if (transactions.length === 0) {
    console.log(
      "Extracted text sample (first 1000 chars):",
      fullText.slice(0, 1000)
    ); // For debugging
    throw new Error(
      "No transactions found. The PDF may not contain readable text or the format is unsupported. Try exporting as CSV from the M-PESA app."
    );
  }

  return processTransactions(transactions);
}

export function processTransactions(
  transactions: Transaction[]
): FinancialSummary {
  const totalSent = transactions
    .filter((t) => t.type === "sent" || t.type === "withdrawn")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalReceived = transactions
    .filter((t) => t.type === "received")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawn = transactions
    .filter((t) => t.type === "withdrawn")
    .reduce((sum, t) => sum + t.amount, 0);

  // Monthly data
  const monthlyMap = new Map<string, { income: number; expenses: number }>();
  transactions.forEach((t) => {
    const month = t.date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, { income: 0, expenses: 0 });
    }
    const data = monthlyMap.get(month)!;
    if (t.type === "received") {
      data.income += t.amount;
    } else {
      data.expenses += t.amount;
    }
  });

  const monthlyData = Array.from(monthlyMap.entries()).map(([month, data]) => ({
    month,
    ...data,
  }));

  // Category breakdown
  const categoryMap = new Map<string, number>();
  transactions
    .filter((t) => t.type !== "received")
    .forEach((t) => {
      categoryMap.set(
        t.category,
        (categoryMap.get(t.category) || 0) + t.amount
      );
    });

  const totalCategorySpending = Array.from(categoryMap.values()).reduce(
    (sum, val) => sum + val,
    0
  );
  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / totalCategorySpending) * 100),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Top recipients
  const recipientMap = new Map<string, { amount: number; count: number }>();
  transactions
    .filter(
      (t) => t.type === "sent" && t.recipient && t.recipient !== "Unknown"
    )
    .forEach((t) => {
      const current = recipientMap.get(t.recipient!) || { amount: 0, count: 0 };
      recipientMap.set(t.recipient!, {
        amount: current.amount + t.amount,
        count: current.count + 1,
      });
    });

  const topRecipients = Array.from(recipientMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const summary: FinancialSummary = {
    totalTransactions: transactions.length,
    totalSent,
    totalReceived,
    totalWithdrawn,
    netChange: totalReceived - totalSent,
    largestTransaction: Math.max(...transactions.map((t) => t.amount)),
    averageTransaction:
      totalSent / transactions.filter((t) => t.type !== "received").length || 0,
    monthlyData,
    categoryBreakdown,
    topRecipients,
    spendingPersonality: "",
    highlights: [],
    transactions,
  };

  summary.spendingPersonality = getSpendingPersonality(summary);
  summary.highlights = generateHighlights(summary);

  return summary;
}

export function generateMockData(): FinancialSummary {
  const mockTransactions: Transaction[] = [
    // Generate realistic mock transactions for 2024
    ...Array.from({ length: 50 }, (_, i) => ({
      date: new Date(
        2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      ),
      type: "received" as const,
      amount: Math.random() * 50000 + 10000,
      sender: ["Employer", "Client", "Freelance Payment"][
        Math.floor(Math.random() * 3)
      ],
      category: "Income",
      balance: 50000,
      details: "Salary payment",
    })),
    ...Array.from({ length: 150 }, (_, i) => ({
      date: new Date(
        2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      ),
      type: ["sent", "withdrawn"][Math.floor(Math.random() * 2)] as
        | "sent"
        | "withdrawn",
      amount: Math.random() * 5000 + 100,
      recipient: ["Supermarket", "Restaurant", "Uber", "Agent", "Friend"][
        Math.floor(Math.random() * 5)
      ],
      category: [
        "Shopping",
        "Food & Dining",
        "Transport",
        "Cash Withdrawal",
        "Transfers",
      ][Math.floor(Math.random() * 5)],
      balance: 30000,
      details: "Purchase",
    })),
  ];

  return processTransactions(mockTransactions);
}
