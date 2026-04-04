import { useEffect, useState } from "react";
import './userProject.css'

function UserProjects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState();
  const [listUser, setListUser] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch("http://127.0.0.1:8000/api/my-projects/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized or error fetching data");
        }
        return res.json();
      })
      .then((data) => setProjects(data))
      .catch((err) => setError(err.message));
  }, [formData]);




  const updateStatus = async (newStatus, id) => {
    if (newStatus === 'valider') {
      try {
        const token = localStorage.getItem("access_token");

        const formData = new FormData();
        formData.append("status", newStatus);
        const res = await fetch(
          `http://localhost:8000/api/projects/cs/vld/${id}/`,
          {
            method: "PATCH",
            headers: {
              // Authorization: `Bearer ${token}`,
            },
            // body: formData,
          }
        );
        if (!res.ok) throw new Error("Failed to update");

        const data = await res.json();
        console.log("Updated:", data);

        // 4. Update UI (IMPORTANT)
        setProjects((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, status: newStatus } : p
          )
        );

      } catch (err) {
        console.error(err);
      }

    }
    else {
      try {
        const token = localStorage.getItem("access_token");
        const formData = new FormData();
        formData.append("status", newStatus);
        const res = await fetch(
          `http://localhost:8000/api/projects/${id}/update/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!res.ok) throw new Error("Failed to update");

        const data = await res.json();
        console.log("Updated:", data);

        // 4. Update UI (IMPORTANT)
        setProjects((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, status: newStatus } : p
          )
        );

      } catch (err) {
        console.error(err);
      }
    }
  };
  return (
    <div className="user-project-page">
      {projects.filter((p) => p.status === "nonvalider").length > 0 && (
        <div>
          <h2>Need validation</h2>

          {projects
            .filter((p) => p.status === "nonvalider")
            .map((p) => (
              <div key={p.id} className="card">
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <h2>{p.price} dt</h2>

                <div>
                  <label onClick={() => updateStatus("not_complete", p.id)} className="click-btn2"> delete</label>
                  <label onClick={() => updateStatus("valider", p.id)}
                  >accept</label>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ---------------------------------------------------------------------------------------- */}

      {projects.filter((p) => p.status === "idea").length > 0 && (
        <div>
          <h2>My Projects idea</h2>

          {projects
            .filter((p) => p.status === "idea")
            .map((p) => (
              <div key={p.id} className="card">
                <h4>{p.name}</h4>
                <p>{p.description}</p>
              </div>
            ))}
        </div>
      )}

      {/* ------------------------------------------------------------------------------------- */}

      {projects.filter((p) => p.status === "valider").length > 0 && (
        <div>
          <h2>In progress</h2>

          {projects
            .filter((p) => p.status === "valider")
            .map((p) => (
              <div key={p.id} className="card">
                <h3>{p.name}</h3>
                <p>prix de {p.price}dt</p>
                {p.start_date && p.end_date && <p>de {p.start_date} a {p.end_date}</p>}
              </div>
            ))}
        </div>
      )}

      {/* ---------------------------------------------------------------------------- */}

      {projects.filter((p) => p.status === "complete").length > 0 && (
        <div>
          <h2>Project terminer</h2>

          {projects
            .filter((p) => p.status === "complete")
            .map((p) => (
              <div key={p.id} className="card">
                <h3>{p.name}</h3>
                <p>{p.status}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default UserProjects;