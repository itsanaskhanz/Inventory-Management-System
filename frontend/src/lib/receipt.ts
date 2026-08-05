import appConfig from "@/config/app.config";

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ReceiptData {
  orderId: string;
  createdAt: string | Date;
  customerName?: string | null;
  customerPhone?: string | null;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  cashReceived?: number;
  due?: number;
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const formatDate = (date: string | Date): string => {
  const value = typeof date === "string" ? new Date(date) : date;
  return value.toLocaleString();
};

const money = (value: number): string =>
  `${appConfig.appCurrencySymbol}${value.toFixed(2)}`;

export const buildReceiptHtml = (data: ReceiptData): string => {
  const rows = data.items
    .map(
      (item) => `
      <tr>
        <td class="item-name">${escapeHtml(item.name)}</td>
        <td style="text-align:center">${item.quantity}</td>
        <td style="text-align:right">${money(item.price)}</td>
        <td style="text-align:right">${money(item.subtotal)}</td>
      </tr>`,
    )
    .join("");

  const customerLines = [
    data.customerName
      ? `<p><span>Customer:</span> ${escapeHtml(data.customerName)}</p>`
      : "",
    data.customerPhone
      ? `<p><span>Phone:</span> ${escapeHtml(data.customerPhone)}</p>`
      : "",
  ].join("");

  const cashReceived = data.cashReceived ?? data.total;
  const due = data.due ?? 0;
  const change = Math.max(0, cashReceived - data.total);
  const paymentLines = [
    `<p class="totals-row"><span>Cash Received</span><span>${money(cashReceived)}</span></p>`,
    due > 0
      ? `<p class="totals-row"><span>Due</span><span>${money(due)}</span></p>`
      : change > 0
        ? `<p class="totals-row"><span>Change</span><span>${money(change)}</span></p>`
        : "",
  ].join("");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Receipt ${escapeHtml(data.orderId)}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: 'Courier New', Courier, monospace;
        background: #f3f4f6;
        display: flex;
        justify-content: center;
        padding: 24px;
      }
      .receipt {
        width: 340px;
        background: #ffffff;
        color: #111827;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      h1 {
        font-size: 18px;
        text-align: center;
        text-transform: uppercase;
        margin-bottom: 2px;
      }
      .store-sub {
        font-size: 12px;
        text-align: center;
        color: #6b7280;
        margin-bottom: 8px;
      }
      .divider {
        border-top: 1px dashed #9ca3af;
        margin: 12px 0;
      }
      p { font-size: 13px; line-height: 1.6; }
      p span { color: #6b7280; }
      .meta { margin-bottom: 4px; }
      table { width: 100%; border-collapse: collapse; font-size: 13px; }
      th { text-align: left; padding: 4px 0; }
      td { padding: 4px 0; vertical-align: top; }
      .item-name { max-width: 140px; overflow-wrap: break-word; }
      .totals p { display: flex; justify-content: space-between; }
      .totals .grand { font-size: 15px; font-weight: bold; }
      .thanks { text-align: center; color: #6b7280; margin-top: 12px; }
      @media print {
        body { background: #ffffff; padding: 0; }
        .receipt { box-shadow: none; border-radius: 0; width: 100%; }
      }
    </style>
  </head>
  <body>
    <div class="receipt">
      <h1>${escapeHtml(appConfig.appName)}</h1>
      <p class="store-sub">Receipt</p>
      <div class="divider"></div>
      <div class="meta">
        <p><span>Order #:</span> ${escapeHtml(data.orderId)}</p>
        <p><span>Date:</span> ${formatDate(data.createdAt)}</p>
        ${customerLines}
      </div>
      <div class="divider"></div>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th style="text-align:center">Qty</th>
            <th style="text-align:right">Price</th>
            <th style="text-align:right">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="divider"></div>
      <div class="totals">
        <p><span>Subtotal</span><span>${money(data.subtotal)}</span></p>
        <p><span>Tax</span><span>${money(data.tax)}</span></p>
        <p class="grand"><span>Total</span><span>${money(data.total)}</span></p>
        ${paymentLines}
      </div>
      <div class="divider"></div>
      <p class="thanks">Thank you for your purchase!</p>
    </div>
  </body>
</html>`;
};

export const printReceipt = (html: string): void => {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText =
    "position:fixed;width:0;height:0;border:0;visibility:hidden;";
  document.body.appendChild(iframe);

  const win = iframe.contentWindow;
  if (!win) {
    iframe.remove();
    return;
  }

  win.document.open();
  win.document.write(html);
  win.document.close();

  const cleanup = () => {
    setTimeout(() => iframe.remove(), 1000);
  };

  win.onafterprint = cleanup;
  win.focus();
  win.print();
  setTimeout(cleanup, 1000);
};

export const downloadReceipt = (data: ReceiptData): void => {
  const html = buildReceiptHtml(data);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `receipt-${data.orderId}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
