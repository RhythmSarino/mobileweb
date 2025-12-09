import { Student } from "../models/Student.js";

export class StudentManager {
  private students: Student[] = [];

  addStudent(student: Student): void {
    this.students.push(student);
    this.saveToLocalStorage();
  }

  getAllStudents(): Student[] {
    return this.students;
  }

  findStudentByID(id: string): Student | undefined {
    return this.students.find(s => s.id === id);
  }

  // แก้: ค้นหาจาก first_name หรือ last_name
  findStudentsByName(name: string): Student[] {
    const keyword = name.trim().toLowerCase();
    if (!keyword) return [];
    return this.students.filter(s =>
      s.first_name.toLowerCase().includes(keyword) ||
      s.last_name.toLowerCase().includes(keyword)
    );
  }

  findStudentsByMajor(major: string): Student[] {
    const keyword = major.trim().toLowerCase();
    if (!keyword) return [];
    return this.students.filter(s =>
      s.major.toLowerCase().includes(keyword)
    );
  }

  findStudentByEmail(email: string): Student | undefined {
    return this.students.find(s => s.email.toLowerCase() === email.trim().toLowerCase());
  }

  saveToLocalStorage(): void {
    localStorage.setItem("students", JSON.stringify(this.students));
  }

  loadFromLocalStorage(): void {
    const data = localStorage.getItem("students");
    if (data) {
      try {
        this.students = JSON.parse(data) as Student[];
      } catch (e) {
        console.error("Failed to parse students from localStorage", e);
        this.students = [];
      }
    }
  }
}
