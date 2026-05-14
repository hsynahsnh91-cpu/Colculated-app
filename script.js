// تحويل التاريخ الهجري إلى ميلادي (تقريبي)
function hijriToGregorian(hijriDate) {
    // معامل تحويل تقريبي (سنة هجرية = 0.97 سنة ميلادية تقريباً)
    const hijriParts = hijriDate.split('-');
    const hijriYear = parseInt(hijriParts[0]);
    const hijriMonth = parseInt(hijriParts[1]) - 1;
    const hijriDay = parseInt(hijriParts[2]);
    
    // تحويل تقريبي باستخدام خوارزمية مبسطة
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

// دالة حساب العمر الرئيسية
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
        // التعامل مع التاريخ الهجري
        birthDate = hijriToGregorian(birthDateInput);
        currentDate = new Date(); // نستخدم التاريخ الميلادي الحالي
    } else {
        // التعامل مع التاريخ الميلادي
        birthDate = new Date(birthDateInput);
        currentDate = new Date();
    }
    
    // حساب الفرق
    let diffMs = currentDate.getTime() - birthDate.getTime();
    
    // إذا كان تاريخ الميلاد في المستقبل
    if (diffMs < 0) {
        alert('تاريخ الميلاد لا يمكن أن يكون في المستقبل!');
        return;
    }
    
    // حساب السنوات
    let ageYears = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
        ageYears--;
    }
    
    // حساب آخر عيد ميلاد
    let lastBirthday = new Date(birthDate);
    lastBirthday.setFullYear(currentDate.getFullYear());
    
    if (lastBirthday > currentDate) {
        lastBirthday.setFullYear(currentDate.getFullYear() - 1);
    }
    
    // حساب الأيام والساعات والدقائق منذ آخر عيد ميلاد
    const diffFromLastBirthday = currentDate.getTime() - lastBirthday.getTime();
    
    const ageDays = Math.floor(diffFromLastBirthday / (1000 * 60 * 60 * 24));
    const ageHours = Math.floor((diffFromLastBirthday % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const ageMinutes = Math.floor((diffFromLastBirthday % (1000 * 60 * 60)) / (1000 * 60));
    
    // حساب عيد الميلاد القادم
    let nextBirthday = new Date(birthDate);
    nextBirthday.setFullYear(currentDate.getFullYear());
    
    if (nextBirthday <= currentDate) {
        nextBirthday.setFullYear(currentDate.getFullYear() + 1);
    }
    
    const daysUntilNextBirthday = Math.ceil((nextBirthday.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // عرض النتائج
    document.getElementById('ageYears').textContent = ageYears;
    document.getElementById('ageDays').textContent = ageDays;
    document.getElementById('ageHours').textContent = ageHours;
    document.getElementById('ageMinutes').textContent = ageMinutes;
    
    const nextBirthdayText = calendarType === 'hijri' ? 
        `باقي ${daysUntilNextBirthday} يوم` : 
        `${nextBirthday.toLocaleDateString('ar-SA')} (باقي ${daysUntilNextBirthday} يوم)`;
    
    document.getElementById('nextBirthday').textContent = nextBirthdayText;
    
    // إظهار النتيجة
    const resultContainer = document.getElementById('result');
    resultContainer.style.display = 'block';
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

// تحديث واجهة المستخدم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تعيين التاريخ الافتراضي
    const today = new Date();
    const defaultDate = today.toISOString().split('T')[0];
    document.getElementById('birthDate').value = defaultDate;
    
    // إضافة حدث لتغيير نوع التقويم
    document.getElementById('calendarType').addEventListener('change', function() {
        const resultContainer = document.getElementById('result');
        resultContainer.style.display = 'none';
    });
});