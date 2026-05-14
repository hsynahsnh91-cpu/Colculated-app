// تحويل التاريخ الهجري إلى ميلادي (تقريبي)
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

// تحويل التاريخ الميلادي إلى هجري (تقريبي)
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

// الحصول على التاريخ الهجري الحالي
function getCurrentHijriDate() {
    const now = new Date();
    const hijri = gregorianToHijri(now);
    return new Date(hijriToGregorian(`${hijri.year}-${hijri.month}-1`));
}

// ========== نظام الإشعارات ==========
let notificationSystem = {
    notificationInterval: null,
    notificationsEnabled: false,
    
    init: function() {
        this.notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';
        this.createNotificationToggle();
        
        if (this.notificationsEnabled && Notification.permission === 'granted') {
            this.startReminders();
            this.updateToggleButton(true);
        }
    },
    
    createNotificationToggle: function() {
        const oldToggle = document.getElementById('notificationToggle');
        if (oldToggle) {
            oldToggle.remove();
        }
        
        const toggle = document.createElement('div');
        toggle.className = 'notification-toggle';
        toggle.id = 'notificationToggle';
        toggle.innerHTML = '🔔 <span>الإشعارات</span> <span class="notification-badge" id="notificationStatus">' + (this.notificationsEnabled ? 'ON' : 'OFF') + '</span>';
        
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
        if (!('Notification' in window)) {
            alert('متصفحك لا يدعم الإشعارات');
            return;
        }

        if (Notification.permission === 'denied') {
            alert('تم حظر الإشعارات. الرجاء السماح بها من إعدادات المتصفح');
            return;
        }

        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.activateNotifications();
                } else {
                    alert('يجب السماح بالإشعارات لتفعيل الميزة');
                }
            });
        } else if (Notification.permission === 'granted') {
            this.activateNotifications();
        }
    },
    
    activateNotifications: function() {
        this.notificationsEnabled = true;
        localStorage.setItem('notificationsEnabled', 'true');
        this.startReminders();
        this.updateToggleButton(true);
        
        this.sendNotification(
            '🎉 تم تفعيل الإشعارات!',
            'سنذكرك بتحديث عمرك بشكل دوري'
        );
    },
    
    disableNotifications: function() {
        this.notificationsEnabled = false;
        localStorage.setItem('notificationsEnabled', 'false');
        this.stopReminders();
        this.updateToggleButton(false);
        
        alert('تم إيقاف الإشعارات');
    },
    
    startReminders: function() {
        this.stopReminders();
        
        setTimeout(() => {
            if (document.hidden && this.notificationsEnabled) {
                this.sendAgeReminder();
            }
        }, 30000);
        
        this.notificationInterval = setInterval(() => {
            if (document.hidden && this.notificationsEnabled) {
                this.sendAgeReminder();
            }
        }, 60 * 60 * 1000);
    },
    
    stopReminders: function() {
        if (this.notificationInterval) {
            clearInterval(this.notificationInterval);
            this.notificationInterval = null;
        }
    },
    
    sendAgeReminder: function() {
        const birthDate = localStorage.getItem('birthDate');
        
        if (birthDate) {
            this.sendNotification(
                '🎂 تذكير من حاسبة العمر',
                'هل تغير عمرك؟ افتح التطبيق لتحديث عمرك!'
            );
        }
    },
    
    sendNotification: function(title, body) {
        if (Notification.permission === 'granted') {
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
        }
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

    const prompt = document.createElement('div');
    prompt.className = 'notification-prompt';
    prompt.id = 'notificationPrompt';
    prompt.innerHTML = `
        <div class="prompt-content">
            <p>🔔 هل تريد تفعيل الإشعارات لتذكيرك بتحديث عمرك عندما تخرج من التطبيق؟</p>
            <div class="prompt-buttons">
                <button class="btn-yes" id="enableNotificationsBtn">
                    ✅ نعم، فعل الإشعارات
                </button>
                <button class="btn-no" id="skipNotificationsBtn">
                    ❌ ليس الآن
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
    
    if (!birthDateInput) {
        alert('الرجاء إدخال تاريخ الميلاد');
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
        alert('تاريخ الميلاد لا يمكن أن يكون في المستقبل!');
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
    
    const nextBirthdayText = calendarType === 'hijri' ? 
        'باقي ' + daysUntilNextBirthday + ' يوم' : 
        nextBirthday.toLocaleDateString('ar-SA') + ' (باقي ' + daysUntilNextBirthday + ' يوم)';
    
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
    // تهيئة نظام الإشعارات
    notificationSystem.init();
    
    // تعيين التاريخ الافتراضي
    const today = new Date();
    const defaultDate = today.toISOString().split('T')[0];
    document.getElementById('birthDate').value = defaultDate;
    
    // ربط زر الحساب بالدالة
    const calculateButton = document.querySelector('button');
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
    
    console.log('✅ التطبيق جاهز للعمل');
});

// مراقبة خروج المستخدم من التطبيق
document.addEventListener('visibilitychange', function() {
    if (document.hidden && notificationSystem.notificationsEnabled) {
        console.log('المستخدم خارج التطبيق - الإشعارات نشطة');
    }
});