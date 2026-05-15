// ========== نظام اللغات ==========
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
        notificationsUnsupported: '⚠️ متصفحك قد لا يدعم الإشعارات بالكامل - لكن سنحاول تفعيلها',
        notificationsBlocked: 'تم حظر الإشعارات. الرجاء السماح بها من إعدادات التطبيق',
        notificationsRequired: 'يجب السماح بالإشعارات لتفعيل الميزة',
        notificationsEnabled: '🎉 تم تفعيل الإشعارات!',
        notificationsEnabledBody: 'ستتلقى رسالة يومية كل 24 ساعة',
        notificationsDisabled: 'تم إيقاف الإشعارات',
        appReady: '✅ التطبيق جاهز للعمل'
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
        notificationsUnsupported: '⚠️ Your browser may not fully support notifications - but we will try to enable them',
        notificationsBlocked: 'Notifications are blocked. Please allow them in your app settings',
        notificationsRequired: 'You must allow notifications to enable this feature',
        notificationsEnabled: '🎉 Notifications Enabled!',
        notificationsEnabledBody: 'You will receive a daily message every 24 hours',
        notificationsDisabled: 'Notifications Disabled',
        appReady: '✅ App is ready to use'
    }
};

let currentLanguage = localStorage.getItem('language') || 'ar';

// ========== نظام اللغات ==========
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    const htmlElement = document.getElementById('htmlRoot');
    const html = document.querySelector('html');
    if (lang === 'ar') {
        htmlElement.lang = 'ar';
        html.dir = 'rtl';
    } else {
        htmlElement.lang = 'en';
        html.dir = 'ltr';
    }
    
    const trans = translations[lang];
    document.getElementById('pageTitle').textContent = trans.pageTitle;
    document.getElementById('pageSubtitle').textContent = trans.pageSubtitle;
    document.getElementById('calendarLabel').textContent = trans.calendarLabel;
    document.getElementById('gregorianOption').textContent = trans.gregorianOption;
    document.getElementById('hijriOption').textContent = trans.hijriOption;
    document.getElementById('birthDateLabel').textContent = trans.birthDateLabel;
    document.getElementById('calculateButton').textContent = trans.calculateButton;
    document.getElementById('nextBirthdayLabel').textContent = trans.nextBirthdayLabel;
    document.getElementById('yearText').textContent = trans.yearText;
    document.getElementById('dayText').textContent = trans.dayText;
    document.getElementById('hourText').textContent = trans.hourText;
    document.getElementById('minuteText').textContent = trans.minuteText;
    
    updateResultText();
}

function updateResultText() {
    const yearSpan = document.querySelector('.age-main span:last-child');
    if (yearSpan) {
        yearSpan.textContent = translations[currentLanguage].yearText;
    }
}

// ========== إدارة القائمة الجانبية ==========
document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.getElementById('menuButton');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const navItems = document.querySelectorAll('.nav-item');
    const languageToggle = document.getElementById('languageToggle');
    
    // فتح القائمة الجانبية
    menuButton.addEventListener('click', () => {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
    });
    
    // إغلاق القائمة الجانبية
    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
    
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
    
    // التنقل بين الصفحات
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const pageName = item.getAttribute('data-page');
            switchPage(pageName);
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    });
    
    // تبديل اللغة
    languageToggle.addEventListener('click', () => {
        const newLang = currentLanguage === 'ar' ? 'en' : 'ar';
        setLanguage(newLang);
    });
    
    // تهيئة نظام الإشعارات
    notificationSystem.init();
    
    // تعيين التاريخ الافتراضي
    const today = new Date();
    const defaultDate = today.toISOString().split('T')[0];
    document.getElementById('birthDate').value = defaultDate;
    
    // تعيين اللغة الأولية
    setLanguage(currentLanguage);
    
    console.log(translations[currentLanguage].appReady);
});

// ========== التنقل بين الصفحات ==========
function switchPage(pageName) {
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => page.style.display = 'none');
    
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        targetPage.style.display = 'block';
        targetPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ========== تحويل التاريخ الهجري إلى ميلادي ==========
function hijriToGregorian(hijriDate) {
    const hijriParts = hijriDate.split('-');
    const hijriYear = parseInt(hijriParts[0]);
    const hijriMonth = parseInt(hijriParts[1]) - 1;
    const hijriDay = parseInt(hijriParts[2]);
    
    const jd = Math.floor((11 * hijriYear + 3) / 30) + 
               354 * hijriYear + 30 * hijriMonth - 
               Math.floor((hijriMonth - 1) / 2) + hijriDay + 1948440 - 385;
    
    const date = new Date((jd - 2440588) * 86400000);
    return date;
}

// ========== تحويل التاريخ الميلادي إلى هجري ==========
function gregorianToHijri(gregorianDate) {
    const date = new Date(gregorianDate);
    const jd = Math.floor(date.getTime() / 86400000) + 2440588;
    
    const hijriYear = Math.floor((30 * (jd - 1948440) + 10646) / 10631);
    const hijriMonth = Math.min(12, Math.ceil((jd - 29 - hijriToGregorianInternal(hijriYear, 1, 1)) / 29.5) + 1);
    
    return { year: hijriYear, month: hijriMonth };
}

function hijriToGregorianInternal(year, month, day) {
    return Math.floor((11 * year + 3) / 30) + 
           354 * year + 30 * month - 
           Math.floor((month - 1) / 2) + day + 1948440 - 385;
}

// ========== نظام الإشعارات اليومية المتقدم ==========
let notificationSystem = {
    notificationInterval: null,
    notificationsEnabled: false,
    supportsNotifications: false,
    
    init: function() {
        this.supportsNotifications = this.checkNotificationSupport();
        this.notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';
        
        if (this.notificationsEnabled) {
            if (this.supportsNotifications && Notification.permission === 'granted') {
                this.startDailyReminders();
            } else if (this.supportsNotifications) {
                this.startDailyReminders();
            }
            this.updateToggleButton(true);
        }
        
        this.setupNotificationButton();
    },
    
    checkNotificationSupport: function() {
        if ('Notification' in window) {
            return true;
        }
        if ('serviceWorker' in navigator) {
            return true;
        }
        return false;
    },
    
    setupNotificationButton: function() {
        const btn = document.getElementById('notificationToggleBtn');
        if (btn) {
            btn.addEventListener('click', () => {
                if (this.notificationsEnabled) {
                    this.disableNotifications();
                } else {
                    this.enableNotifications();
                }
            });
        }
    },
    
    enableNotifications: function() {
        if (!this.supportsNotifications) {
            alert(translations[currentLanguage].notificationsUnsupported);
            this.activateNotifications();
            return;
        }

        if (Notification.permission === 'denied') {
            alert(translations[currentLanguage].notificationsBlocked);
            return;
        }

        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.activateNotifications();
                } else if (permission === 'default') {
                    this.activateNotifications();
                } else {
                    alert(translations[currentLanguage].notificationsRequired);
                }
            }).catch(error => {
                console.log('خطأ في طلب الإذن:', error);
                this.activateNotifications();
            });
        } else if (Notification.permission === 'granted') {
            this.activateNotifications();
        }
    },
    
    activateNotifications: function() {
        this.notificationsEnabled = true;
        localStorage.setItem('notificationsEnabled', 'true');
        localStorage.setItem('lastNotificationTime', Date.now().toString());
        this.startDailyReminders();
        this.updateToggleButton(true);
        
        const trans = translations[currentLanguage];
        this.sendNotification(
            trans.notificationsEnabled,
            trans.notificationsEnabledBody
        );
    },
    
    disableNotifications: function() {
        this.notificationsEnabled = false;
        localStorage.setItem('notificationsEnabled', 'false');
        this.stopReminders();
        this.updateToggleButton(false);
        
        alert(translations[currentLanguage].notificationsDisabled);
    },
    
    startDailyReminders: function() {
        this.stopReminders();
        
        const lastNotificationTime = parseInt(localStorage.getItem('lastNotificationTime') || '0');
        const now = Date.now();
        const timeSinceLastNotification = now - lastNotificationTime;
        const oneDay = 24 * 60 * 60 * 1000;
        
        if (timeSinceLastNotification >= oneDay) {
            this.sendDailyMessage();
            localStorage.setItem('lastNotificationTime', now.toString());
        }
        
        this.notificationInterval = setInterval(() => {
            if (this.notificationsEnabled) {
                const lastTime = parseInt(localStorage.getItem('lastNotificationTime') || '0');
                const timeSinceLastMessage = Date.now() - lastTime;
                
                if (timeSinceLastMessage >= oneDay) {
                    this.sendDailyMessage();
                    localStorage.setItem('lastNotificationTime', Date.now().toString());
                }
            }
        }, 60 * 60 * 1000);
    },
    
    stopReminders: function() {
        if (this.notificationInterval) {
            clearInterval(this.notificationInterval);
            this.notificationInterval = null;
        }
    },
    
    sendDailyMessage: function() {
        this.sendNotification('message of calculator', 'لاتنس ذكر الله');
    },
    
    sendNotification: function(title, body) {
        try {
            if ('Notification' in window && Notification.permission === 'granted') {
                const options = {
                    body: body,
                    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎂</text></svg>',
                    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎂</text></svg>',
                    vibrate: [200, 100, 200],
                    tag: 'age-calculator-reminder'
                };
                
                const notification = new Notification(title, options);
                notification.onclick = function() {
                    window.focus();
                    notification.close();
                };
            } else {
                this.sendViaServiceWorker(title, body);
            }
        } catch (error) {
            console.log('خطأ في الإشعار:', error);
        }
    },
    
    sendViaServiceWorker: function(title, body) {
        if ('serviceWorker' in navigator && 'registration' in navigator.serviceWorker) {
            navigator.serviceWorker.ready.then(registration => {
                if (registration && registration.showNotification) {
                    registration.showNotification(title, {
                        body: body,
                        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎂</text></svg>',
                        vibrate: [200, 100, 200],
                        tag: 'age-calculator-reminder'
                    });
                }
            }).catch(err => {
                console.log('خطأ Service Worker:', err);
            });
        }
    },
    
    updateToggleButton: function(isActive) {
        const statusBadge = document.getElementById('notificationStatus');
        if (statusBadge) {
            if (isActive) {
                statusBadge.textContent = 'ON';
                statusBadge.classList.add('active');
            } else {
                statusBadge.textContent = 'OFF';
                statusBadge.classList.remove('active');
            }
        }
    }
};

// ========== نافذة طلب الإشعارات ==========
function showNotificationPrompt() {
    if (localStorage.getItem('notificationPromptShown') === 'true') {
        return;
    }
    
    const oldPrompt = document.getElementById('notificationPrompt');
    if (oldPrompt) {
        oldPrompt.remove();
    }
    
    const trans = translations[currentLanguage];
    const prompt = document.createElement('div');
    prompt.className = 'notification-prompt';
    prompt.id = 'notificationPrompt';
    prompt.innerHTML = `
        <div class="prompt-content">
            <p>${trans.notificationPrompt}</p>
            <div class="prompt-buttons">
                <button class="btn-yes" id="enableNotificationsBtn">
                    ${trans.enableNotifications}
                </button>
                <button class="btn-no" id="skipNotificationsBtn">
                    ${trans.skipNotifications}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(prompt);
    
    document.getElementById('enableNotificationsBtn').onclick = function() {
        notificationSystem.enableNotifications();
        prompt.remove();
        localStorage.setItem('notificationPromptShown', 'true');
    };
    
    document.getElementById('skipNotificationsBtn').onclick = function() {
        prompt.remove();
        localStorage.setItem('notificationPromptShown', 'true');
    };
}

// ========== دالة حساب العمر ==========
function calculateAge() {
    const calendarType = document.getElementById('calendarType').value;
    const birthDateInput = document.getElementById('birthDate').value;
    const trans = translations[currentLanguage];
    
    if (!birthDateInput) {
        alert(trans.errorBirthDate);
        return;
    }
    
    let birthDate;
    let currentDate;
    
    if (calendarType === 'hijri') {
        birthDate = hijriToGregorian(birthDateInput);
        currentDate = new Date();
    } else {
        birthDate = new Date(birthDateInput);
        currentDate = new Date();
    }
    
    let diffMs = currentDate.getTime() - birthDate.getTime();
    
    if (diffMs < 0) {
        alert(trans.errorFutureDate);
        return;
    }
    
    let ageYears = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
        ageYears--;
    }
    
    let lastBirthday = new Date(birthDate);
    lastBirthday.setFullYear(currentDate.getFullYear());
    
    if (lastBirthday > currentDate) {
        lastBirthday.setFullYear(currentDate.getFullYear() - 1);
    }
    
    const diffFromLastBirthday = currentDate.getTime() - lastBirthday.getTime();
    
    const ageDays = Math.floor(diffFromLastBirthday / (1000 * 60 * 60 * 24));
    const ageHours = Math.floor((diffFromLastBirthday % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const ageMinutes = Math.floor((diffFromLastBirthday % (1000 * 60 * 60)) / (1000 * 60));
    
    let nextBirthday = new Date(birthDate);
    nextBirthday.setFullYear(currentDate.getFullYear());
    
    if (nextBirthday <= currentDate) {
        nextBirthday.setFullYear(currentDate.getFullYear() + 1);
    }
    
    const daysUntilNextBirthday = Math.ceil((nextBirthday.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    
    document.getElementById('ageYears').textContent = ageYears;
    document.getElementById('ageDays').textContent = ageDays;
    document.getElementById('ageHours').textContent = ageHours;
    document.getElementById('ageMinutes').textContent = ageMinutes;
    
    let nextBirthdayText;
    if (calendarType === 'hijri') {
        nextBirthdayText = trans.nextBirthdayDays(daysUntilNextBirthday);
    } else {
        const locale = currentLanguage === 'ar' ? 'ar-SA' : 'en-US';
        nextBirthdayText = nextBirthday.toLocaleDateString(locale) + ' (' + trans.nextBirthdayDays(daysUntilNextBirthday) + ')';
    }
    
    document.getElementById('nextBirthday').textContent = nextBirthdayText;
    
    const resultContainer = document.getElementById('result');
    resultContainer.style.display = 'block';
    
    localStorage.setItem('birthDate', birthDateInput);
    localStorage.setItem('calendarType', calendarType);
    
    setTimeout(() => {
        if (!notificationSystem.notificationsEnabled) {
            showNotificationPrompt();
        }
    }, 2000);
}

// ========== الآلة الحاسبة البسيطة ==========
let calcDisplay = '';

function appendToCalc(value) {
    const display = document.getElementById('calcDisplay');
    calcDisplay += value;
    display.value = calcDisplay;
}

function calculateResult() {
    const display = document.getElementById('calcDisplay');
    try {
        calcDisplay = eval(calcDisplay).toString();
        display.value = calcDisplay;
    } catch (error) {
        display.value = 'خطأ';
        calcDisplay = '';
    }
}

function clearCalc() {
    calcDisplay = '';
    document.getElementById('calcDisplay').value = '';
}

// تسجيل Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('تنبيه: لم يتمكن من تسجيل Service Worker:', err);
    });
}
