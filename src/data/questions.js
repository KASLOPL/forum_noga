import { useEffect, useState } from "react";

// Domyślne pytania
const defaultQuestions = [
  {
    id: 1,
    author: "Anna K.",
    timeAgo: "2 godziny temu",
    highlight: "Jak zoptymalizować zapytania SQL w dużej bazie danych?",
    tags: ["SQL", "Database", "Performance"],
    content: "Mam problem z wydajnością zapytań SQL w bazie danych zawierającej miliony rekordów...",
    fullContent: "Pracuję nad aplikacją, która musi przetwarzać duże ilości danych...",
    likes: 23,
    views: 1284,
    responders: 3
  },
  {
    id: 2,
    author: "Tomasz M.",
    timeAgo: "4 godziny temu",
    highlight: "React Hook useEffect - problem z nieskończoną pętlą",
    tags: ["React", "JavaScript", "Hooks"],
    content: "Mój useEffect wchodzi w nieskończoną pętlą rerenderowania...",
    fullContent: "Pracuję nad komponentem React, który ma pobierać dane z API...",
    likes: 45,
    views: 892,
    responders: 5
  },
  {
    id: 3,
    author: "Michał P.",
    timeAgo: "6 godzin temu",
    highlight: "Algorytmy sortowania - który wybrać dla dużych zbiorów danych?",
    tags: ["Algorithms", "Performance", "Data Structures"],
    content: "Potrzebuję posortować tablicę z 100,000+ elementów...",
    fullContent: "Pracuję nad aplikacją, która musi sortować bardzo duże zbiory danych...",
    likes: 31,
    views: 567,
    responders: 4
  },
  {
    id: 4,
    author: "Julia W.",
    timeAgo: "8 godzin temu",
    highlight: "CSS Grid vs Flexbox - kiedy używać którego?",
    tags: ["CSS", "Layout", "Frontend"],
    content: "Ciągle się zastanawiam, kiedy powinienem używać CSS Grid...",
    fullContent: "Uczę się nowoczesnego CSS-a i mam problem z wyborem między Grid a Flexbox...",
    likes: 18,
    views: 743,
    responders: 6
  }
];

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Pobierz pytania z localStorage
    const stored = localStorage.getItem("questions");
    const localQuestions = stored ? JSON.parse(stored) : [];

    // Połącz z domyślnymi
    const combined = [...localQuestions, ...defaultQuestions];

    setQuestions(combined);
  }, []);

  return (
    <div>
      <h1>Lista pytań</h1>
      {questions.map((q) => (
        <div key={q.id} style={{ borderBottom: "1px solid #ccc", marginBottom: "1em" }}>
          <h3>{q.highlight}</h3>
          <p><strong>Autor:</strong> {q.author}</p>
          <p><strong>Treść:</strong> {q.content}</p>
          <p><strong>Tagi:</strong> {q.tags.join(", ")}</p>
          <p><strong>Polubienia:</strong> {q.likes ?? 0} | <strong>Odsłony:</strong> {q.views ?? 0} | <strong>Odpowiedzi:</strong> {q.responders ?? 0}</p>
        </div>
      ))}
    </div>
  );
};

export default QuestionsPage;