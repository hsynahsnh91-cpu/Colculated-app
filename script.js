// CENTRAL SCRIPT: language, UI navigation, age calculator, calculator, notifications
const translations = {
  ar: {
    pageTitle: '🎂 حاسبة العمر',
    pageSubtitle: 'احسب عمرك بالميلادي والهجري بدقة',
    calendarLabel: 'نوع التاريخ:',
    gregorianOption: 'ميلادي',
    hijriOption: 'هجري',
    birthDateLabel: 'تاريخ الميلاد:',
    calculateButton: 'احسب العمر 🕒',
    yearText: 'سنة',
    dayText: 'يوم',
    hourText: 'ساعة',
    minuteText: 'دقيقة',
    nextBirthdayLabel: '🎈 عيد ميلادك القادم:',
    nextBirthdayDays: (days) => `باقي ${days} يوم`,
    notificationsLabel: 'الإشعارات',
    notificationPrompt: '🔔 هل تريد تفعيل الإشعارات لتلقي رسالة يومية؟',
    enableNotifications: '✅ نعم، فعل الإشعارات',
    skipNotifications: '❌ ليس الآن',
    notificationsUnsupported: '⚠️ متصفحك قد لا يدعم الإشعارات بالكامل',
    notificationsBlocked: 'تم حظر الإشعارات. الرجاء السماح بها من إعدادات التطبيق',
    notificationsRequired: 'يجب السماح بالإشعارات لتفعيل الميزة',
    notificationsEnabled: '🎉 تم تفعيل الإشعارات!',
    notificationsEnabledBody: 'ستتلقى رسالة يومية كل 24 ساعة',
    notificationsDisabled: 'تم إيقاف الإشعارات',
    appReady: '✅ التطبيق جاهز للعمل',
    errorBirthDate: 'الرجاء تحديد تاريخ الميلاد',
    errorFutureDate: 'الرجاء اختيار تاريخ لا يزيد عن اليوم'
  },
  en: {
    pageTitle: '🎂 Age Calculator',
    pageSubtitle: 'Calculate your age in Gregorian and Hijri calendar accurately',
    calendarLabel: 'Calendar Type:',
    gregorianOption: 'Gregorian',
    hijriOption: 'Hijri',
    birthDateLabel: 'Birth Date:',
    calculateButton: 'Calculate Age 🕒',
    yearText: 'year',
    dayText: 'day',
    hourText: 'hour',
    minuteText: 'minute',
    nextBirthdayLabel: '🎈 Your Next Birthday:',
    nextBirthdayDays: (days) => `${days} days remaining`,
    notificationsLabel: 'Notifications',
    notificationPrompt: '🔔 Do you want to enable notifications to receive a daily message?',
    enableNotifications: '✅ Yes, Enable Notifications',
    skipNotifications: '❌ Not Now',
    notificationsUnsupported: '⚠️ Your browser may not fully support notifications',
    notificationsBlocked: 'Notifications are blocked. Please allow them in your app settings',
    notificationsRequired: 'You must allow notifications to enable this feature',
    notificationsEnabled: '🎉 Notifications Enabled!',
    notificationsEnabledBody: 'You will receive a daily message every 24 hours',
    notificationsDisabled: 'Notifications Disabled',
    appReady: '✅ App is ready to use',
    errorBirthDate: 'Please select a birth date',
    errorFutureDate: 'Please choose a date not in the future'
  }
};

let currentLanguage = localStorage.getItem('language') || 'ar';

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);

  const htmlEl = document.getElementById('htmlRoot');
  const html = document.documentElement;
  if (lang === 'ar') {
    htmlEl.lang = 'ar';
    html.dir = 'rtl';
  } else {
    htmlEl.lang = 'en';
    html.dir = 'ltr';
  }

  const t = translations[lang];
  const pageTitle = document.getElementById('pageTitle');
  if (pageTitle) pageTitle.textContent = t.pageTitle;
  const pageSubtitle = document.getElementById('pageSubtitle');
  if (pageSubtitle) pageSubtitle.textContent = t.pageSubtitle;
  const calendarLabel = document.getElementById('calendarLabel');
  if (calendarLabel) calendarLabel.textContent = t.calendarLabel;
  const gregorianOption = document.getElementById('gregorianOption');
  if (gregorianOption) gregorianOption.textContent = t.gregorianOption;
  const hijriOption = document.getElementById('hijriOption');
  if (hijriOption) hijriOption.textContent = t.hijriOption;
  const birthDateLabel = document.getElementById('birthDateLabel');
  if (birthDateLabel) birthDateLabel.textContent = t.birthDateLabel;
  const calculateButton = document.getElementById('calculateButton');
  if (calculateButton) calculateButton.textContent = t.calculateButton;
  const nextBirthdayLabel = document.getElementById('nextBirthdayLabel');
  if (nextBirthdayLabel) nextBirthdayLabel.textContent = t.nextBirthdayLabel;
  const yearText = document.getElementById('yearText');
  if (yearText) yearText.textContent = t.yearText;
  const dayText = document.getElementById('dayText');
  if (dayText) dayText.textContent = t.dayText;
  const hourText = document.getElementById('hourText');
  if (hourText) hourText.textContent = t.hourText;
  const minuteText = document.getElementById('minuteText');
  if (minuteText) minuteText.textContent = t.minuteText;

  // language button text
  const languageText = document.getElementById('languageText');
  if (languageText) languageText.textContent = lang === 'ar' ? 'العربية' : 'English';
}

// Hijri/Gregorian helpers (lightweight approx)
function hijriToGregorian(hijriDate) {
  // expected format YYYY-MM-DD
  const parts = hijriDate.split('-');
  const y = parseInt(parts[0]);
  const m = parseInt(parts[1]);
  const d = parseInt(parts[2]);
  // approximate conversion using algorithm (not perfect but ok for UI)
  const jd = Math.floor((11 * y + 3) / 30) + 354 * y + 30 * (m - 1) - Math.floor((m - 1) / 2) + d + 1948440 - 385;
  const date = new Date((jd - 2440588) * 86400000);
  return date;
}

// Notification system
const notificationSystem = {
  notificationInterval: null,
  notificationsEnabled: localStorage.getItem('notificationsEnabled') === 'true',
  supportsNotifications: ('Notification' in window) || ('serviceWorker' in navigator),

  init() {
    // update badge
    this.updateToggleButton(this.notificationsEnabled);
  },

  updateToggleButton(isActive) {
    const statusBadge = document.getElementById('notificationStatus');
    if (!statusBadge) return;
    if (isActive) {
      statusBadge.textContent = 'ON';
      statusBadge.classList.add('active');
    } else {
      statusBadge.textContent = 'OFF';
      statusBadge.classList.remove('active');
    }
  },

  enableNotifications() {
    if (!this.supportsNotifications) {
      alert(translations[currentLanguage].notificationsUnsupported);
      return;
    }
    if (Notification.permission === 'denied') {
      alert(translations[currentLanguage].notificationsBlocked);
      return;
    }
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        this.notificationsEnabled = true;
        localStorage.setItem('notificationsEnabled', 'true');
        this.updateToggleButton(true);
        this.sendNotification(translations[currentLanguage].notificationsEnabled, translations[currentLanguage].notificationsEnabledBody);
        this.startDailyReminders();
      } else {
        alert(translations[currentLanguage].notificationsRequired);
      }
    }).catch(err => console.error(err));
  },

  disableNotifications() {
    this.notificationsEnabled = false;
    localStorage.setItem('notificationsEnabled', 'false');
    this.updateToggleButton(false);
    this.stopReminders();
    alert(translations[currentLanguage].notificationsDisabled);
  },

  startDailyReminders() {
    this.stopReminders();
    if (!this.notificationsEnabled) return;
    const oneDay = 24 * 60 * 60 * 1000;
    const last = parseInt(localStorage.getItem('lastNotificationTime') || '0');
    const now = Date.now();
    if (now - last >= oneDay) {
      this.sendDailyMessage();
      localStorage.setItem('lastNotificationTime', String(now));
    }
    this.notificationInterval = setInterval(() => {
      const last2 = parseInt(localStorage.getItem('lastNotificationTime') || '0');
      if (Date.now() - last2 >= oneDay) {
        this.sendDailyMessage();
        localStorage.setItem('lastNotificationTime', String(Date.now()));
      }
    }, 60 * 60 * 1000);
  },

  stopReminders() {
    if (this.notificationInterval) clearInterval(this.notificationInterval);
    this.notificationInterval = null;
  },

  sendDailyMessage() {
    const title = 'message of calculator';
    const body = 'لاتنس ذكر الله';
    this.sendNotification(title, body);
  },

  sendNotification(title, body) {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        const options = { body, tag: 'age-reminder' };
        new Notification(title, options);
      } else if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(reg => {
          if (reg.showNotification) reg.showNotification(title, { body, tag: 'age-reminder' });
        });
      }
    } catch (e) {
      console.error('notification error', e);
    }
  }
};

// Utility: show prompt once
function showNotificationPrompt() {
  if (localStorage.getItem('notificationPromptShown') === 'true') return;
  const t = translations[currentLanguage];
  const prompt = document.createElement('div');
  prompt.className = 'notification-prompt';
  prompt.innerHTML = `\n    <div class="prompt-content">\n      <p>${t.notificationPrompt}</p>\n      <div class="prompt-buttons">\n        <button id="enableNotificationsBtn">${t.enableNotifications}</button>\n        <button id="skipNotificationsBtn">${t.skipNotifications}</button>\n      </div>\n    </div>`;
  document.body.appendChild(prompt);
  document.getElementById('enableNotificationsBtn').onclick = () => { notificationSystem.enableNotifications(); prompt.remove(); localStorage.setItem('notificationPromptShown','true'); };
  document.getElementById('skipNotificationsBtn').onclick = () => { prompt.remove(); localStorage.setItem('notificationPromptShown','true'); };
}

// Age calculation (used by HTML button onclick)
function calculateAge() {
  const calendarType = document.getElementById('calendarType').value;
  const birthDateInput = document.getElementById('birthDate').value;
  const t = translations[currentLanguage];
  if (!birthDateInput) { alert(t.errorBirthDate); return; }

  let birthDate = calendarType === 'hijri' ? hijriToGregorian(birthDateInput) : new Date(birthDateInput);
  const now = new Date();
  if (birthDate.getTime() > now.getTime()) { alert(t.errorFutureDate); return; }

  // calculate years
  let years = now.getFullYear() - birthDate.getFullYear();
  const mDiff = now.getMonth() - birthDate.getMonth();
  if (mDiff < 0 || (mDiff === 0 && now.getDate() < birthDate.getDate())) years--;

  // since last birthday
  let lastBirthday = new Date(birthDate);
  lastBirthday.setFullYear(now.getFullYear());
  if (lastBirthday > now) lastBirthday.setFullYear(now.getFullYear() - 1);
  const diff = now.getTime() - lastBirthday.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  let nextBirthday = new Date(birthDate);
  nextBirthday.setFullYear(now.getFullYear());
  if (nextBirthday <= now) nextBirthday.setFullYear(now.getFullYear() + 1);
  const daysUntilNextBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  document.getElementById('ageYears').textContent = years;
  document.getElementById('ageDays').textContent = days;
  document.getElementById('ageHours').textContent = hours;
  document.getElementById('ageMinutes').textContent = minutes;

  const nextBirthdayText = (calendarType === 'hijri') ? translations[currentLanguage].nextBirthdayDays(daysUntilNextBirthday) : (nextBirthday.toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US') + ' (' + translations[currentLanguage].nextBirthdayDays(daysUntilNextBirthday) + ')');
  document.getElementById('nextBirthday').textContent = nextBirthdayText;

  document.getElementById('result').style.display = 'block';

  localStorage.setItem('birthDate', birthDateInput);
  localStorage.setItem('calendarType', calendarType);

  // prompt for notifications if not enabled
  setTimeout(() => { if (!notificationSystem.notificationsEnabled) showNotificationPrompt(); }, 1200);
}

// Simple calculator functions (names match HTML buttons)
let calcDisplay = '';
function appendCalc(val) {
  // replace comma with dot
  if (val === ',') val = '.';
  calcDisplay += val;
  const d = document.getElementById('calcDisplay');
  if (d) d.textContent = calcDisplay || '0';
}
function calculateCalc() {
  const d = document.getElementById('calcDisplay');
  try {
    const expr = calcDisplay.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    // evaluation using Function (slightly safer than eval)
    const res = Function('return (' + expr + ')')();
    calcDisplay = String(res);
    if (d) d.textContent = calcDisplay;
  } catch (e) {
    if (d) d.textContent = 'خطأ';
    calcDisplay = '';
  }
}
function deleteCalc() {
  calcDisplay = calcDisplay.slice(0, -1);
  const d = document.getElementById('calcDisplay');
  if (d) d.textContent = calcDisplay || '0';
}
function clearCalc() {
  calcDisplay = '';
  const d = document.getElementById('calcDisplay');
  if (d) d.textContent = '0';
}

// Navigation between app sections
function switchPage(pageName) {
  const pages = document.querySelectorAll('.app-section');
  pages.forEach(p => p.style.display = 'none');
  const target = document.getElementById(pageName + '-app');
  if (target) target.style.display = 'block';
}

// DOM ready wiring
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const closeSidebar = document.getElementById('closeSidebar');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const navBtns = document.querySelectorAll('.nav-btn');
  const languageToggle = document.getElementById('languageToggle');
  const notificationToggle = document.getElementById('notificationToggle');

  if (menuBtn) menuBtn.addEventListener('click', () => { sidebar.classList.add('open'); sidebarOverlay.classList.add('open'); });
  if (closeSidebar) closeSidebar.addEventListener('click', () => { sidebar.classList.remove('open'); sidebarOverlay.classList.remove('open'); });
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', () => { sidebar.classList.remove('open'); sidebarOverlay.classList.remove('open'); });

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const app = btn.getAttribute('data-app');
      if (app) switchPage(app);
      navBtns.forEach(n => n.classList.remove('active'));
      btn.classList.add('active');
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('open');
    });
  });

  if (languageToggle) languageToggle.addEventListener('click', () => { setLanguage(currentLanguage === 'ar' ? 'en' : 'ar'); });
  if (notificationToggle) notificationToggle.addEventListener('click', () => { if (notificationSystem.notificationsEnabled) notificationSystem.disableNotifications(); else notificationSystem.enableNotifications(); });

  // default: show age calculator
  const ageApp = document.getElementById('age-calculator-app');
  if (ageApp) ageApp.style.display = 'block';
  const calcApp = document.getElementById('calculator-app');
  if (calcApp) calcApp.style.display = 'none';

  // set birth date default
  const today = new Date();
  const iso = today.toISOString().split('T')[0];
  const birthInput = document.getElementById('birthDate');
  if (birthInput) birthInput.value = localStorage.getItem('birthDate') || iso;

  // initialize language and notifications
  setLanguage(currentLanguage);
  notificationSystem.init();

  // try register service worker if present
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.warn('sw register failed', err));
  }
});
