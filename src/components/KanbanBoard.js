import React, { useState, useEffect } from "react";
import Axios from "axios";
import CardComponent from "./CardComponent";
import "./KanbanBoard.css"
const KanbanBoard = () => {
  const [groupedTickets, setGroupedTickets] = useState({});
  const [grouping, setGrouping] = useState("status");
  const [sorting, setSorting] = useState("priority");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(
          "https://api.quicksell.co/v1/internal/frontend-assignment"
        );

        const grouped = groupTickets(response.data.tickets, grouping);
        const sortedGroups = sortGroups(grouped, sorting);

        setGroupedTickets(sortedGroups);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [grouping, sorting]);

  useEffect(() => {
    localStorage.setItem("selectedGrouping", grouping);
    localStorage.setItem("selectedSorting", sorting);
  }, [grouping, sorting]);

  useEffect(() => {
    const savedGrouping = localStorage.getItem("selectedGrouping");
    const savedSorting = localStorage.getItem("selectedSorting");
    if (savedGrouping && savedSorting) {
      setGrouping(savedGrouping);
      setSorting(savedSorting);
    }
  }, []);

  const groupTickets = (tickets, grouping) => {
    
    const grouped = {};
    tickets.forEach((ticket) => {
      const key = ticket[grouping];
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(ticket);
    });
    return grouped;
  };

  const sortGroups = (groups, sorting) => {
    
    const sortedGroups = {};
    for (const group in groups) {
      sortedGroups[group] = groups[group].sort((a, b) => {
        if (sorting === "priority") {
          return b.priority - a.priority;
        } else if (sorting === "title") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
    }
    return sortedGroups;
  };

  return (
    <div className="kanban-board">
      <header className="header">
        <h1>Kanban Board</h1>
        <select
          className="options "
          value={grouping}
          onChange={(e) => setGrouping(e.target.value)}
        >
          <option value="status">By Status</option>
          <option value="priority">By Priority</option>
          <option value="userId">By User</option>
          </select>
        <select
          className="options"
          value={sorting}
          onChange={(e) => setSorting(e.target.value)}
        > <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </header>
      <body style={{ display: "flex", flexDirection: "row" }}>
        {Object.keys(groupedTickets).length === 0 ? (
          <p>Nothing to show</p>
        ) : (
          Object.keys(groupedTickets).map((group) => (
            <div key={group}>
              <h2>{group}</h2>
              {groupedTickets[group].map((ticket) => (
                <CardComponent
                  key={ticket.id}
                  id={ticket.id}
                  image={ticket.image}
                  title={ticket.title}
                  Dynamic={ticket.Dynamic}
                />
              ))}
            </div>
          ))
        )}
      </body>
      <footer>
        <p>Total tickets: {Object.values(groupedTickets).flat().length}</p>
      </footer>
    </div>
  );
};

export default KanbanBoard;
