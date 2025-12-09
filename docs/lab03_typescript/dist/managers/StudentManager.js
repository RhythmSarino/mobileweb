export class StudentManager {
    constructor() {
        this.students = [];
    }
    addStudent(student) {
        this.students.push(student);
        this.saveToLocalStorage();
    }
    getAllStudents() {
        return this.students;
    }
    findStudentByID(id) {
        return this.students.find(s => s.id === id);
    }
    // แก้: ค้นหาจาก first_name หรือ last_name
    findStudentsByName(name) {
        const keyword = name.trim().toLowerCase();
        if (!keyword)
            return [];
        return this.students.filter(s => s.first_name.toLowerCase().includes(keyword) ||
            s.last_name.toLowerCase().includes(keyword));
    }
    findStudentsByMajor(major) {
        const keyword = major.trim().toLowerCase();
        if (!keyword)
            return [];
        return this.students.filter(s => s.major.toLowerCase().includes(keyword));
    }
    // เพิ่ม: ค้นหาด้วย email
    findStudentByEmail(email) {
        return this.students.find(s => s.email.toLowerCase() === email.trim().toLowerCase());
    }
    saveToLocalStorage() {
        localStorage.setItem("students", JSON.stringify(this.students));
    }
    loadFromLocalStorage() {
        const data = localStorage.getItem("students");
        if (data) {
            try {
                this.students = JSON.parse(data);
            }
            catch (e) {
                console.error("Failed to parse students from localStorage", e);
                this.students = [];
            }
        }
    }
}
