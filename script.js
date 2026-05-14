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
        languageToggleText: 'English',
        languageToggleAria: 'تبديل اللغة',
        errorBirthDate: 'الرجاء إدخال تاريخ الميلاد',
        errorFutureDate: 'تاريخ الميلاد لا يمكن أن يكون في المستقبل!',
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
        languageToggleText: 'العربية',
        languageToggleAria: 'Toggle Language',
        errorBirthDate: 'Please enter your birth date',
        errorFutureDate: 'Birth date cannot be in the future!',
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

// دالة تحديث اللغة
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // تحديث اتجاه الصفحة
    const htmlElement = document.getElementById('htmlRoot');
    const html = document.querySelector('html');
    if (lang === 'ar') {
        htmlElement.lang = 'ar';
        html.dir = 'rtl';
    } else {
        htmlElement.lang = 'en';
        html.dir = 'ltr';
    }
    
    // تحديث النصوص
    const trans = translations[lang];
    document.getElementById('pageTitle').textContent = trans.pageTitle;
    document.getElementById('pageSubtitle').textContent = trans.pageSubtitle;
    document.getElementById('calendarLabel').textContent = trans.calendarLabel;
    document.getElementById('gregorianOption').textContent = trans.gregorianOption;
    document.getElementById('hijriOption').textContent = trans.hijriOption;
    document.getElementById('birthDateLabel').textContent = trans.birthDateLabel;
    document.getElementById('calculateButton').textContent = trans.calculateButton;
    document.getElementById('languageText').textContent = trans.languageToggleText;
    document.getElementById('languageToggle').setAttribute('aria-label', trans.languageToggleAria);
    document.getElementById('nextBirthdayLabel').textContent = trans.nextBirthdayLabel;
    document.getElementById('yearText').textContent = trans.yearText;
    document.getElementById('dayText').textContent = trans.dayText;
    document.getElementById('hourText').textContent = trans.hourText;
    document.getElementById('minuteText').textContent = trans.minuteText;
    
    // تحديث نص الإشعارات إذا كان موجوداً
    const notificationToggle = document.getElementById('notificationToggle');
    if (notificationToggle) {
        const notification = notificationToggle.querySelector('span:not(.notification-badge)');
        if (notification) {
            notification.textContent = trans.notificationsLabel;
        }
    }
    
    // تحديث النتيجة إذا كانت مرئية
    updateResultText();
}

function updateResultText() {
    const yearSpan = document.querySelector('.age-main span:last-child');
    if (yearSpan) {
        yearSpan.textContent = translations[currentLanguage].yearText;
    }
}

// زر التبديل بين اللغات
document.addEventListener('DOMContentLoaded', function() {
    const languageToggle = document.getElementById('languageToggle');
    
    languageToggle.addEventListener('click', function() {
        const newLang = currentLanguage === 'ar' ? 'en' : 'ar';
        setLanguage(newLang);
    });
    
    // تحديث اللغة الأولية
    setLanguage(currentLanguage);
});

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

// ========== نظام الإشعارات اليومية المتقدم (متوافق مع APK) ==========
let notificationSystem = {
    notificationInterval: null,
    notificationsEnabled: false,
    supportsNotifications: false,
    
    init: function() {
        // التحقق من دعم الإشعارات
        this.supportsNotifications = this.checkNotificationSupport();
        
        this.notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';
        this.createNotificationToggle();
        
        if (this.notificationsEnabled) {
            if (this.supportsNotifications && Notification.permission === 'granted') {
                this.startDailyReminders();
            } else if (this.supportsNotifications) {
                this.startDailyReminders(); // محاولة بدء النظام حتى بدون إذن
            }
            this.updateToggleButton(true);
        }
    },
    
    checkNotificationSupport: function() {
        // التحقق من دعم الإشعارات في المتصفح/التطبيق
        if ('Notification' in window) {
            return true;
        }
        // محاولة استخدام خيارات بديلة
        if ('serviceWorker' in navigator) {
            return true;
        }
        return false;
    },
    
    createNotificationToggle: function() {
        const oldToggle = document.getElementById('notificationToggle');
        if (oldToggle) {
            oldToggle.remove();
        }
        
        const toggle = document.createElement('div');
        toggle.className = 'notification-toggle';
        toggle.id = 'notificationToggle';
        const trans = translations[currentLanguage];
        toggle.innerHTML = '🔔 <span>' + trans.notificationsLabel + '</span> <span class="notification-badge" id="notificationStatus">' + (this.notificationsEnabled ? 'ON' : 'OFF') + '</span>';
        
        toggle.onclick = () => {
            if (this.notificationsEnabled) {
                this.disableNotifications();
            } else {
                this.enableNotifications();
            }
        };
        
        document.body.appendChild(toggle);
        
        if (this.notificationsEnabled) {
            toggle.classList.add('notification-active');
        }
    },
    
    enableNotifications: function() {
        if (!this.supportsNotifications) {
            alert(translations[currentLanguage].notificationsUnsupported);
            // حتى لو لا يدعم، سنحاول تفعيله
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
                    // محاولة التفعيل حتى بدون إذن في APK
                    this.activateNotifications();
                } else {
                    alert(translations[currentLanguage].notificationsRequired);
                }
            }).catch(error => {
                console.log('خطأ في طلب الإذن:', error);
                // في APK قد لا يكون هناك استجابة، لكن سنحاول تفعيل الميزة
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
        const oneDay = 24 * 60 * 60 * 1000; // 24 ساعة
        
        // إذا مرت 24 ساعة أو أكثر، أرسل إشعار فوراً
        if (timeSinceLastNotification >= oneDay) {
            this.sendDailyMessage();
            localStorage.setItem('lastNotificationTime', now.toString());
        }
        
        // تحقق كل ساعة من الحاجة لإرسال إشعار
        this.notificationInterval = setInterval(() => {
            if (this.notificationsEnabled) {
                const lastTime = parseInt(localStorage.getItem('lastNotificationTime') || '0');
                const timeSinceLastMessage = Date.now() - lastTime;
                
                // إذا مرت 24 ساعة، أرسل الإشعار التالي
                if (timeSinceLastMessage >= oneDay) {
                    this.sendDailyMessage();
                    localStorage.setItem('lastNotificationTime', Date.now().toString());
                    console.log('📢 تم إرسال الإشعار اليومي');
                }
            }
        }, 60 * 60 * 1000); // التحقق كل ساعة
    },
    
    stopReminders: function() {
        if (this.notificationInterval) {
            clearInterval(this.notificationInterval);
            this.notificationInterval = null;
        }
    },
    
    sendDailyMessage: function() {
        // الرسالة المطلوبة
        this.sendNotification('message of calculator', 'لاتنس ذكر الله');
    },
    
    sendNotification: function(title, body) {
        try {
            // المحاولة الأولى: استخدام Notification API الكلاسيكي
            if ('Notification' in window && Notification.permission === 'granted') {
                const options = {
                    body: body,
                    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎂</text></svg>',
                    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎂</text></svg>',
                    vibrate: [200, 100, 200],
                    tag: 'age-calculator-reminder',
                    requireInteraction: false
                };
                
                const notification = new Notification(title, options);
                
                notification.onclick = function() {
                    window.focus();
                    notification.close();
                };
                
                console.log('✅ إشعار مرسل: ' + title);
            } else {
                // المحاولة الثانية: Service Worker (للAPK)
                this.sendViaServiceWorker(title, body);
            }
        } catch (error) {
            console.log('خطأ في الإشعار:', error);
            // المحاولة الثالثة: تنبيه بديل
            this.showFallbackAlert(title, body);
        }
    },
    
    sendViaServiceWorker: function(title, body) {
        if ('serviceWorker' in navigator && 'registration' in navigator.serviceWorker) {
            navigator.serviceWorker.ready.then(registration => {
                if (registration && registration.showNotification) {
                    registration.showNotification(title, {
                        body: body,
                        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎂</text></svg>',
                        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎂</text></svg>',
                        vibrate: [200, 100, 200],
                        tag: 'age-calculator-reminder'
                    });
                    console.log('✅ إشعار عبر Service Worker');
                }
            }).catch(err => {
                console.log('خطأ Service Worker:', err);
            });
        }
    },
    
    showFallbackAlert: function(title, body) {
        // في حالة عدم دعم الإشعارات، نعرض alert
        console.log('📬 رسالة: ' + title + ' - ' + body);
    },
    
    updateToggleButton: function(isActive) {
        const toggle = document.getElementById('notificationToggle');
        const statusBadge = document.getElementById('notificationStatus');
        
        if (toggle && statusBadge) {
            if (isActive) {
                toggle.classList.add('notification-active');
                statusBadge.textContent = 'ON';
                statusBadge.style.background = '#4CAF50';
            } else {
                toggle.classList.remove('notification-active');
                statusBadge.textContent = 'OFF';
                statusBadge.style.background = '#f44336';
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

// ========== دالة حساب العمر الرئيسية ==========
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
    resultContainer.scrollIntoView({ behavior: 'smooth' });
    
    // حفظ البيانات للإشعارات
    localStorage.setItem('birthDate', birthDateInput);
    localStorage.setItem('calendarType', calendarType);
    
    // إظهار نافذة طلب الإشعارات بعد 2 ثانية
    setTimeout(() => {
        if (!notificationSystem.notificationsEnabled) {
            showNotificationPrompt();
        }
    }, 2000);
}

// ========== تهيئة الصفحة ==========
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة نظام الإشعارات (متوافق مع APK)
    notificationSystem.init();
    
    // تعيين التاريخ الافتراضي
    const today = new Date();
    const defaultDate = today.toISOString().split('T')[0];
    document.getElementById('birthDate').value = defaultDate;
    
    // ربط زر الحساب بالدالة
    const calculateButton = document.querySelector('button[onclick]');
    if (calculateButton) {
        calculateButton.onclick = function(e) {
            e.preventDefault();
            calculateAge();
        };
    }
    
    // إضافة حدث لتغيير نوع التقويم
    const calendarSelect = document.getElementById('calendarType');
    if (calendarSelect) {
        calendarSelect.onchange = function() {
            document.getElementById('result').style.display = 'none';
        };
    }
    
    console.log(translations[currentLanguage].appReady);
});

// مراقبة خروج المستخدم من التطبيق
document.addEventListener('visibilitychange', function() {
    if (document.hidden && notificationSystem.notificationsEnabled) {
        console.log('User left the app - Notifications are active');
    }
});

// تسجيل Service Worker (لدعم الإشعارات في APK)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('تنبيه: لم يتمكن من تسجيل Service Worker:', err);
    });
}
