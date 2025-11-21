// --- БАЗОВЫЙ СЛОВАРЬ (Только ручной перевод для качества) ---
var TRANSLATIONS = {
  'ru': {
    menuName: 'Экспорт вкладки',
    menuQuick: 'Экспорт выбранной вкладки',
    menuAny: 'Экспорт любой вкладки',
    dialogAuto: 'Скачивание: ',
    dialogManual: 'Экспорт вкладки',
    fmtPdf: 'PDF Документ (.pdf)',
    fmtDocx: 'Microsoft Word (.docx)',
    fmtTxt: 'Текст (.txt)',
    fmtHtml: 'Веб-страница (.html)',
    fmtEpub: 'EPUB публикация (.epub)',
    badgeFormat: 'Формат: ',
    lblTab: 'Выберите вкладку:',
    lblFile: 'Имя файла:',
    phFile: 'Введите имя файла',
    btnDownload: 'Скачать',
    btnPreparing: 'Подготовка...',
    msgLoading: 'Загрузка структуры...',
    msgNotFound: 'Вкладки не найдены',
    msgWholeDoc: 'Весь документ',
    msgError: 'Ошибка: ',
    msgDone: 'Готово!',
    msgDownloaded: 'Файл скачан!',
    msgEnterName: 'Введите имя файла.',
    autoPrep: 'Подготовка файла...',
    errApi: 'Ошибка API: '
  },
  'en': {
    menuName: 'Export Tab',
    menuQuick: 'Export Selected Tab',
    menuAny: 'Export Any Tab',
    dialogAuto: 'Downloading: ',
    dialogManual: 'Export Tab',
    fmtPdf: 'PDF Document (.pdf)',
    fmtDocx: 'Microsoft Word (.docx)',
    fmtTxt: 'Plain Text (.txt)',
    fmtHtml: 'Web Page (.html)',
    fmtEpub: 'EPUB Publication (.epub)',
    badgeFormat: 'Format: ',
    lblTab: 'Select tab:',
    lblFile: 'Filename:',
    phFile: 'Enter filename',
    btnDownload: 'Download',
    btnPreparing: 'Preparing...',
    msgLoading: 'Loading structure...',
    msgNotFound: 'No tabs found',
    msgWholeDoc: 'Whole document',
    msgError: 'Error: ',
    msgDone: 'Done!',
    msgDownloaded: 'File downloaded!',
    msgEnterName: 'Please enter a filename.',
    autoPrep: 'Preparing file...',
    errApi: 'API Error: '
  }
};

var FORMAT_KEYS = {
  'pdf': 'fmtPdf', 'docx': 'fmtDocx', 'txt': 'fmtTxt', 'html': 'fmtHtml', 'epub': 'fmtEpub'
};

/**
 * Умная функция получения текстов:
 * 1. Ищет ручной перевод.
 * 2. Если нет - ищет в кэше.
 * 3. Если нет - переводит через Google Translate.
 */
function getStrings() {
  var userLocale = Session.getActiveUserLocale(); // Например "fr_FR" или "de"
  var lang = userLocale.split('_')[0].toLowerCase(); // Берем "fr" или "de"

  // 1. Если есть ручной перевод (RU/EN), возвращаем его
  if (TRANSLATIONS[lang]) {
    return TRANSLATIONS[lang];
  }

  // 2. Пробуем найти в кэше (чтобы скрипт работал быстро)
  var cache = CacheService.getUserCache();
  var cachedJSON = cache.get('lang_' + lang);
  if (cachedJSON) {
    return JSON.parse(cachedJSON);
  }

  // 3. Если языка нет, делаем автоматический перевод с Английского
  var base = TRANSLATIONS['en'];
  var translatedObj = {};
  
  // Собираем все значения в массив для пакетного перевода (это быстрее и дешевле по квотам)
  var keys = Object.keys(base);
  var valuesToTranslate = keys.map(function(k) { return base[k]; });
  
  try {
    // Пытаемся перевести
    // LanguageApp.translate может не перевести сложные технические термины идеально, но это лучше чем ничего
    var translatedText = "";
    
    // Переводим каждое значение цикла (LanguageApp не умеет переводить массивы одной строкой идеально без разделителей)
    // Для интерфейса это допустимо по скорости
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var original = base[key];
      // Перевод с английского на язык пользователя
      var trans = LanguageApp.translate(original, 'en', lang);
      translatedObj[key] = trans;
    }

    // Сохраняем результат в кэш на 6 часов (21600 сек), чтобы в следующий раз открылось мгновенно
    cache.put('lang_' + lang, JSON.stringify(translatedObj), 21600);
    
    return translatedObj;
    
  } catch (e) {
    // Если сервис перевода недоступен, возвращаем английский
    console.warn("Translation failed: " + e);
    return TRANSLATIONS['en'];
  }
}

// --- ДАЛЕЕ СТАНДАРТНЫЙ КОД ---

function onOpen() {
  var ui = DocumentApp.getUi();
  var text = getStrings(); 

  var mainMenu = ui.createMenu(text.menuName);
  var quickMenu = ui.createMenu(text.menuQuick);
  
  quickMenu.addItem(text.fmtPdf, 'exportSelPDF');
  quickMenu.addItem(text.fmtDocx, 'exportSelDOCX');
  quickMenu.addItem(text.fmtTxt, 'exportSelTXT');
  quickMenu.addItem(text.fmtHtml, 'exportSelHTML');
  quickMenu.addItem(text.fmtEpub, 'exportSelEPUB');

  var anyMenu = ui.createMenu(text.menuAny);
  anyMenu.addItem(text.fmtPdf, 'exportAnyPDF');
  anyMenu.addItem(text.fmtDocx, 'exportAnyDOCX');
  anyMenu.addItem(text.fmtTxt, 'exportAnyTXT');
  anyMenu.addItem(text.fmtHtml, 'exportAnyHTML');
  anyMenu.addItem(text.fmtEpub, 'exportAnyEPUB');

  mainMenu.addSubMenu(quickMenu).addSeparator().addSubMenu(anyMenu).addToUi();
}

function _forceDriveScope() { DriveApp.getStorageLimit(); }

function exportSelPDF()  { openExportDialog('pdf', 'auto'); }
function exportSelDOCX() { openExportDialog('docx', 'auto'); }
function exportSelTXT()  { openExportDialog('txt', 'auto'); }
function exportSelHTML() { openExportDialog('html', 'auto'); }
function exportSelEPUB() { openExportDialog('epub', 'auto'); }

function exportAnyPDF()  { openExportDialog('pdf', 'manual'); }
function exportAnyDOCX() { openExportDialog('docx', 'manual'); }
function exportAnyTXT()  { openExportDialog('txt', 'manual'); }
function exportAnyHTML() { openExportDialog('html', 'manual'); }
function exportAnyEPUB() { openExportDialog('epub', 'manual'); }

function openExportDialog(formatKey, mode) {
  var text = getStrings();
  var template = HtmlService.createTemplateFromFile('Sidebar');
  
  template.targetFormat = formatKey;
  template.targetLabel = text[FORMAT_KEYS[formatKey]]; 
  template.mode = mode;
  template.text = text; 
  
  var html = template.evaluate();
  var title = (mode === 'auto') ? text.dialogAuto + text[FORMAT_KEYS[formatKey]] : text.dialogManual;

  if (mode === 'auto') {
    html.setTitle(title).setWidth(350).setHeight(120);
  } else {
    html.setTitle(title).setWidth(400).setHeight(300);
  }
      
  DocumentApp.getUi().showModalDialog(html, mode === 'auto' ? text.btnPreparing : title);
}

function getDocumentData() {
  var doc = DocumentApp.getActiveDocument();
  var docId = doc.getId();
  var tabsList = [];
  var activeTabId = null;
  var token = ScriptApp.getOAuthToken();
  var text = getStrings();

  try {
    var currentTab = doc.getActiveTab();
    if (currentTab) activeTabId = currentTab.getId();
  } catch (e) { console.warn(e); }

  try {
    var url = 'https://docs.googleapis.com/v1/documents/' + docId + '?fields=tabs,title';
    var response = UrlFetchApp.fetch(url, {
      headers: { 'Authorization': 'Bearer ' + token },
      muteHttpExceptions: true
    });
    var docContent = JSON.parse(response.getContentText());

    if (docContent.tabs && docContent.tabs.length > 0) {
      processTabsJsonRecursively(docContent.tabs, tabsList, 0);
    } else {
      tabsList.push({ id: '', name: doc.getName() + " (" + text.msgWholeDoc + ")" });
    }
  } catch (e) {
    console.error(e);
    tabsList.push({ id: 'error', name: text.errApi + e.message });
  }

  return { docId: docId, tabs: tabsList, activeTabId: activeTabId };
}

function processTabsJsonRecursively(tabsJson, list, level) {
  if (!tabsJson) return;
  tabsJson.forEach(function(tab) {
    var props = tab.tabProperties;
    if (props) {
      var prefix = "";
      for (var i = 0; i < level; i++) prefix += "-- ";
      list.push({ id: props.tabId, name: prefix + props.title, rawTitle: props.title });
      if (tab.childTabs) processTabsJsonRecursively(tab.childTabs, list, level + 1);
    }
  });
}

function processFileDownload(docId, tabId, format, filename) {
  var token = ScriptApp.getOAuthToken();
  var url = 'https://docs.google.com/document/d/' + docId + '/export?format=' + format;
  
  if (tabId) {
    var paramId = tabId;
    if (!paramId.startsWith('t.') && !paramId.includes('.')) paramId = 't.' + paramId;
    url += '&id=' + docId + '&tab=' + paramId; 
  }

  try {
    var response = UrlFetchApp.fetch(url, {
      headers: { 'Authorization': 'Bearer ' + token },
      muteHttpExceptions: true
    });
    if (response.getResponseCode() !== 200) throw new Error("HTTP " + response.getResponseCode());
    
    var blob = response.getBlob();
    var ext = '.' + format;
    if (!filename.toLowerCase().endsWith(ext)) filename += ext;
    
    return {
      base64: Utilities.base64Encode(blob.getBytes()),
      filename: filename,
      mimeType: blob.getContentType()
    };
  } catch (e) { throw new Error(e.message); }
}
