import React, { useState } from "react";

type StudentResult = {
id: number;
name: string;
studentClass: string;
subject: string;
ca: number;
exam: number;
};

export default function Results() {
const [results, setResults] = useState<StudentResult[]>([]);
const [name, setName] = useState("");
const [studentClass, setStudentClass] = useState("Basic 1");
const [subject, setSubject] = useState("English");
const [ca, setCa] = useState("");
const [exam, setExam] = useState("");

function addResult(e: React.FormEvent<HTMLFormElement>) {
e.preventDefault();

const caScore = Number(ca);
const examScore = Number(exam);

if (!name.trim() || ca === "" || exam === "") {
  alert("Please fill in all fields.");
  return;
}

if (
  !Number.isFinite(caScore) ||
  !Number.isFinite(examScore) ||
  caScore < 0 ||
  caScore > 40 ||
  examScore < 0 ||
  examScore > 60
) {
  alert("CA must be 0–40 and Exam must be 0–60.");
  return;
}

setResults((previous) => [
  ...previous,
  {
    id: Date.now(),
    name: name.trim(),
    studentClass,
    subject,
    ca: caScore,
    exam: examScore,
  },
]);

setName("");
setCa("");
setExam("");

}

function getGrade(total: number) {
if (total >= 80) return "A";
if (total >= 70) return "B";
if (total >= 60) return "C";
if (total >= 50) return "D";
if (total >= 40) return "E";
return "F";
}

return (
<main style={{ padding: 20, maxWidth: 1000, margin: "auto" }}>
<header style={{ background: "#075b38", color: "white", padding: 20, borderRadius: 10 }}>
<h1>Darul Muttaqeen International School</h1>
<h2>Students' Results</h2>
<p>Continuous Assessment: 40 marks | Examination: 60 marks</p>
</header>

  <form onSubmit={addResult} style={{ marginTop: 24, display: "grid", gap: 12 }}>
    <label>
      Student Name
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter student name"
        required
        style={{ display: "block", width: "100%", padding: 10, marginTop: 5, boxSizing: "border-box" }}
      />
    </label>

    <label>
      Class
      <select value={studentClass} onChange={(e) => setStudentClass(e.target.value)} style={{ display: "block", padding: 10, width: "100%" }}>
        {["Nursery 1", "Nursery 2", "Nursery 3", "Basic 1", "Basic 2", "Basic 3", "Basic 4", "Basic 5", "Basic 6"].map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>

    <label>
      Subject
      <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ display: "block", padding: 10, width: "100%" }}>
        {["English", "Mathematics", "Jolly Phonics", "Basic Science", "Social Studies", "Arabic", "Qur'an & Tahfiz", "CCA", "PHE", "Nigerian History"].map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>

    <label>
      CA Score (0–40)
      <input type="number" min="0" max="40" value={ca} onChange={(e) => setCa(e.target.value)} required style={{ display: "block", width: "100%", padding: 10, marginTop: 5, boxSizing: "border-box" }} />
    </label>

    <label>
      Exam Score (0–60)
      <input type="number" min="0" max="60" value={exam} onChange={(e) => setExam(e.target.value)} required style={{ display: "block", width: "100%", padding: 10, marginTop: 5, boxSizing: "border-box" }} />
    </label>

    <button type="submit" style={{ padding: 12, background: "#075b38", color: "white", border: 0, borderRadius: 6, fontWeight: "bold" }}>
      Add Result
    </button>
  </form>

  <h2 style={{ marginTop: 30 }}>Results List</h2>

  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
      <thead>
        <tr style={{ background: "#e5f1e9" }}>
          {["Student", "Class", "Subject", "CA / 40", "Exam / 60", "Total / 100", "Grade"].map((heading) => (
            <th key={heading} style={{ border: "1px solid #ccc", padding: 10, textAlign: "left" }}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {results.map((result) => {
          const total = result.ca + result.exam;
          return (
            <tr key={result.id}>
              <td style={{ border: "1px solid #ccc", padding: 10 }}>{result.name}</td>
              <td style={{ border: "1px solid #ccc", padding: 10 }}>{result.studentClass}</td>
              <td style={{ border: "1px solid #ccc", padding: 10 }}>{result.subject}</td>
              <td style={{ border: "1px solid #ccc", padding: 10 }}>{result.ca}</td>
              <td style={{ border: "1px solid #ccc", padding: 10 }}>{result.exam}</td>
              <td style={{ border: "1px solid #ccc", padding: 10 }}>{total}</td>
              <td style={{ border: "1px solid #ccc", padding: 10 }}>{getGrade(total)}</td>
            </tr>
          );
        })}
        {results.length === 0 && (
          <tr>
            <td colSpan={7} style={{ padding: 20, textAlign: "center" }}>No results added yet.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</main>

);
}