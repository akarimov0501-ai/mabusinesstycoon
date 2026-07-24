export const USD_TO_UZS_RATE = 12800;

export function formatMoney(amount: number, currency: 'USD' | 'UZS' = 'USD'): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return currency === 'UZS' ? '0 so\'m' : '$0';
  }

  const isNegative = amount < 0;
  const absUSD = Math.abs(amount);

  if (currency === 'UZS') {
    const absUZS = absUSD * USD_TO_UZS_RATE;
    let formatted = '';
    if (absUZS >= 1e15) {
      formatted = `${(absUZS / 1e15).toFixed(2)} Kv. so'm`;
    } else if (absUZS >= 1e12) {
      formatted = `${(absUZS / 1e12).toFixed(2)} Trln. so'm`;
    } else if (absUZS >= 1e9) {
      formatted = `${(absUZS / 1e9).toFixed(2)} Mlrd. so'm`;
    } else if (absUZS >= 1e6) {
      formatted = `${(absUZS / 1e6).toFixed(2)} Mln. so'm`;
    } else if (absUZS >= 1e3) {
      formatted = `${(absUZS / 1e3).toFixed(2)} Ming so'm`;
    } else {
      formatted = `${Math.round(absUZS).toLocaleString('uz-UZ')} so'm`;
    }
    return isNegative ? `-${formatted}` : formatted;
  }

  // Default USD
  let formatted = '';
  if (absUSD >= 1e18) {
    formatted = `$${(absUSD / 1e18).toFixed(2)}Qi`;
  } else if (absUSD >= 1e15) {
    formatted = `$${(absUSD / 1e15).toFixed(2)}Qa`;
  } else if (absUSD >= 1e12) {
    formatted = `$${(absUSD / 1e12).toFixed(2)}T`;
  } else if (absUSD >= 1e9) {
    formatted = `$${(absUSD / 1e9).toFixed(2)}B`;
  } else if (absUSD >= 1e6) {
    formatted = `$${(absUSD / 1e6).toFixed(2)}M`;
  } else if (absUSD >= 1e3) {
    formatted = `$${(absUSD / 1e3).toFixed(2)}K`;
  } else {
    formatted = `$${absUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return isNegative ? `-${formatted}` : formatted;
}

export function formatNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toLocaleString('en-US');
}

export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

export function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

