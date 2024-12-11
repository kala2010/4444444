// البيانات الأساسية
const classes = [
    "7A", "7B", "8A", "8B", "9A", "9B", "9C", "9G"
];

const months = [
    "شهر 9", "شهر 10", "شهر 11", "شهر 12", 
    "شهر 1", "شهر 2", "شهر 3", "شهر 4", "شهر 5", "شهر 6"
];

const days = Array.from({ length: 31 }, (_, i) => i + 1);

const studentsPerClass = 40;

// بيانات الطلاب
const data = {};

// تهيئة البيانات
function initializeData() {
    classes.forEach(cls => {
        data[cls] = {};
        months.forEach(month => {
            data[cls][month] = {};
            days.forEach(day => {
                data[cls][month][day] = Array.from({ length: studentsPerClass }, (_, id) => ({
                    id: id + 1,
                    name: "",
                    image: "https://via.placeholder.com/100",
                    status: "none" // حالة اليوم
                }));
            });
        });
    });
}

// عرض الصفوف
function loadClasses() {
    const classButtons = document.getElementById("class-buttons");
    classes.forEach(cls => {
        const button = document.createElement("button");
        button.textContent = cls;
        button.onclick = () => showMonths(cls);
        classButtons.appendChild(button);
    });
}

// عرض الأشهر
function showMonths(cls) {
    document.getElementById("class-selection").style.display = "none";
    document.getElementById("month-selection").style.display = "block";

    const monthButtons = document.getElementById("month-buttons");
    monthButtons.innerHTML = "";
    months.forEach(month => {
        const button = document.createElement("button");
        button.textContent = month;
        button.onclick = () => showDays(cls, month);
        monthButtons.appendChild(button);
    });
}

// عرض الأيام
function showDays(cls, month) {
    document.getElementById("month-selection").style.display = "none";
    document.getElementById("day-selection").style.display = "block";

    const dayButtons = document.getElementById("day-buttons");
    dayButtons.innerHTML = "";
    days.forEach(day => {
        const button = document.createElement("button");
        button.textContent = `ڕۆژ ${day}`;
        button.onclick = () => showStudents(cls, month, day);
        dayButtons.appendChild(button);
    });
}

// عرض الطلاب
function showStudents(cls, month, day) {
    document.getElementById("day-selection").style.display = "none";
    document.getElementById("student-list").style.display = "block";

    const studentsDiv = document.getElementById("students");
    studentsDiv.innerHTML = "";

    document.getElementById("class-day-name").textContent = `${cls} - ${month} - ڕۆژ ${day}`;

    data[cls][month][day].forEach(student => {
        const studentCard = document.createElement("div");
        studentCard.className = "student-card";

        const studentImg = document.createElement("img");
        studentImg.src = student.image;
        studentImg.alt = `قوتابی ${student.id}`;

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.placeholder = "ناوی قوتابی";
        nameInput.value = student.name;
        nameInput.oninput = e => (student.name = e.target.value);

        const actionButtons = document.createElement("div");
        actionButtons.className = "action-buttons";

        ["ئامادةبوون", "ئامادةنةبوون", "مولةت"].forEach(status => {
            const button = document.createElement("button");
            button.textContent = status;
            button.onclick = () => {
                student.status = status;
                alert(`${student.name || `قوتابی ${student.id}`} - ${status}`);
            };
            actionButtons.appendChild(button);
        });

        studentCard.appendChild(studentImg);
        studentCard.appendChild(nameInput);
        studentCard.appendChild(actionButtons);

        studentsDiv.appendChild(studentCard);
    });
}

// أزرار الرجوع
function backToClasses() {
    document.getElementById("month-selection").style.display = "none";
    document.getElementById("class-selection").style.display = "block";
}

function backToMonths() {
    document.getElementById("day-selection").style.display = "none";
    document.getElementById("month-selection").style.display = "block";
}

function backToDays() {
    document.getElementById("student-list").style.display = "none";
    document.getElementById("day-selection").style.display = "block";
}

// حفظ البيانات إلى Excel
function saveData() {
    const wb = XLSX.utils.book_new();

    Object.keys(data).forEach(cls => {
        Object.keys(data[cls]).forEach(month => {
            Object.keys(data[cls][month]).forEach(day => {
                const wsData = [
                    ["ID", "ناو", "بارودۆخ"],
                    ...data[cls][month][day].map(student => [student.id, student.name, student.status])
                ];

                const ws = XLSX.utils.aoa_to_sheet(wsData);
                XLSX.utils.book_append_sheet(wb, ws, `${cls}-${month}-${day}`);
            });
        });
    });

    XLSX.writeFile(wb, "قوتابخانەى_قەلاى_ئيواران.xlsx");
}

// بدء تشغيل التطبيق
window.onload = () => {
    initializeData();
    loadClasses();
};
