import { useState } from "react";

export default function useSearchPopout() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTags, setSearchTags] = useState([
    { id: "1", label: "Design & UX" },
    { id: "2", label: "Figma" },
    { id: "3", label: "App idea / MVP" },
    { id: "4", label: "Project help" },
  ]);
  const [recentItems] = useState([
    { id: "1", text: "Why is my Python script running so slow?" },
    { id: "2", text: "How to fix memory leak in React components?" },
    { id: "3", text: "CSS flexbox center align items" },
    { id: "4", text: "Best practices for SQL database design?" },
    { id: "5", text: "JavaScript async await error handling" },
    { id: "6", text: "Best practices for SQL database design?" },
    { id: "7", text: "JavaScript async await error handling" },
  ]);

  const removeTag = (tagId) => {
    setSearchTags(searchTags.filter((tag) => tag.id !== tagId));
  };

  const togglePopup = () => {
    setIsOpen((prev) => !prev);
  };

  return {
    isOpen,
    searchTags,
    recentItems,
    removeTag,
    togglePopup,
    setIsOpen,
    setSearchTags,
  };
} 