// App scripts file to create json endpoint for infgo in a gsheet
// Script must be created from gsheets
// Deploy as web app with access to everyone

function doGet() {
  const list = getListings();
  return ContentService
    .createTextOutput(JSON.stringify(list))
    .setMimeType(ContentService.MimeType.JSON);
}

function getListings() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName('DATA: Going');
  if (!sheet) throw new Error('Sheet "DATA: Going" not found.');

  const data = sheet.getDataRange().getDisplayValues();
  const listings = [];

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    //from connected gsheet
    const name = row[0];   // Name column
    const catRaw = row[2];   // category/tag column
    const rawPrice = row[7];   // Price (int or string e.g. 100, "free")
    const rawPhoto = row[10];  // img src url
    const soldFlag = row[13];  // boolean

    const price = String(rawPrice).trim();
    if (!name || !price || !rawPhoto) continue;

    // Extract ALL image URLs
    const urls = [...new Set(String(rawPhoto).match(urlRegex) || [])];
    if (!urls.length) continue;

    // Determine sold state (DO NOT filter out anymore)
    const soldStr = String(soldFlag).toLowerCase().trim();
    const isSold = ['true', 'yes', 'sold', '1'].includes(soldStr);

    // CATEGORY LABEL LOGIC
    let labels = [];
    if (catRaw) {
      labels = catRaw
        .split(",")
        .map(v => v.trim())
        .filter(v => v.length > 0);
    }

    listings.push({
      name,
      price,
      images: urls,
      labels,
      sold: isSold
    });
  }

  return listings;
}
