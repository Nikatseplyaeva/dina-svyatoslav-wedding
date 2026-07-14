// Google Apps Script — receives RSVP submissions from the wedding site
// and appends each one as a row in the bound Google Sheet.
//
// Setup: see ../apps-script/README.md

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RSVP') ||
              SpreadsheetApp.getActiveSpreadsheet().insertSheet('RSVP');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Отправлено', 'Имя', 'Придёт?', 'Гостей', 'Напитки', 'Блюдо']);
  }

  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.attend === 'yes' ? 'Да, буду' : 'Не смогу',
    data.guests || '',
    (data.drinks || []).join(', '),
    data.dish || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
