"use client"

import { useState } from "react"
import { useLocation } from "react-router-dom";
import { Search, Zap, Home, Bell, Users, Clock, BarChart2, Settings, HelpCircle, Grid, List } from "lucide-react"
import "./search.css"
import React from "react";

export default function SearchPage() {
  const [viewMode, setViewMode] = useState("grid")
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q") || "";
  const [searchValue, setSearchValue] = useState(query);

  // Synchronizuj input jeśli query w URL się zmieni
  React.useEffect(() => {
    setSearchValue(query);
  }, [query]);

  return (
    <div className="searc">
    <div className="snapsolve-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo">
            <Zap className="logo-icon" />
          </div>
          <h1 className="brand-name">Snapsolve</h1>
        </div>

        <button className="add-question-btn">
          <span>ADD QUESTION</span>
          <div className="square-icon"></div>
        </button>

        <nav className="nav-menu">
          <a href="#" className="nav-item">
            <Home className="nav-icon" />
            <span>Home</span>
          </a>
          <a href="#" className="nav-item">
            <Bell className="nav-icon" />
            <span>Notifications</span>
          </a>
          <a href="#" className="nav-item">
            <Users className="nav-icon" />
            <span>Specialists</span>
          </a>
          <a href="#" className="nav-item">
            <Clock className="nav-icon" />
            <span>My Questions</span>
          </a>
          <a href="#" className="nav-item">
            <BarChart2 className="nav-icon" />
            <span>Activity & Stats</span>
          </a>
        </nav>

        <div className="bottom-nav">
          <a href="#" className="nav-item">
            <Settings className="nav-icon" />
            <span>Settings</span>
          </a>
          <a href="#" className="nav-item">
            <HelpCircle className="nav-icon" />
            <span>Help & FAQ</span>
          </a>
        </div>

        <div className="user-profile">
          <div className="avatar">BK</div>
          <div className="user-info">
            <div className="user-name">Basjan Kojko</div>
            <div className="user-role">Student</div>
          </div>
        </div>

        <button className="sign-out-btn">Sign out</button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="Got a question? See if it's already asked!"
            />
          </div>
          <div className="user-avatar">
            <div className="avatar-circle"></div>
          </div>
        </header>

        <div className="results-container">
          <h2 className="results-title">
            {query ? <>Wyniki dla: <b>{query}</b></> : "Wyniki wyszukiwania"}
          </h2>

          <div className="filters-row">
            <div className="filters">
              <div className="filter-dropdown">
                <span>All Time</span>
                <span className="dropdown-arrow">▼</span>
              </div>

              <div className="filter-dropdown">
                <span>Question Status</span>
                <span className="dropdown-arrow">▼</span>
              </div>
            </div>

            <div className="sort-view">
              <div className="sort-dropdown">
                <span>Sort By:</span>
                <span className="sort-value">All</span>
                <span className="dropdown-arrow">▼</span>
              </div>

              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid size={18} />
                </button>
                <button
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="results-list">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="result-item"></div>
            ))}
          </div>
        </div>
      </main>
    </div>
    </div>
  )
}
