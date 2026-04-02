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


  // const updateStatus = async (newStatus, id) => {
  //   try {
  //     try {
  //       const res = await fetch(`http://localhost:8000/api/min-member/`, {
  //         method: "GET",
  //       });
  //       if (!res.ok) throw new Error("Failed to update status");

  //       // const list_user = await res.json();
  //       // const dataUsers = await res.json(); // ✅ get response مباشرة
  //       // setListUser(dataUsers.ids);
  //       // setListUser(await res.json().ids)

  //       const dataUsers = await res.json();
  //       setListUser(dataUsers.ids);
  //       console.log(listUser +'55555555555555')


  //       // formData.append("status", newStatus);
  //       console.log(listUser)
  //       formData.append("assigned_members", listUser);

      
      

  //     const res2 = await fetch(`http://localhost:8000/api/projects/${id}/update/`, {
  //       method: "PATCH",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: formData,
  //     });

  //     if (!res.ok) throw new Error("Failed to update status");

  //     const data = await res2.json();
  //     console.log("Updated:", data);

  //     // optional: update UI state
  //     setFormData(prev => ({ ...prev, status: newStatus }));


  //     } catch (err) {
  //       console.error(err);
  //     }
  //     const token = localStorage.getItem("access_token");

  //     const formData = new FormData();




      

  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const updateStatus = async (newStatus, id) => {
  try {
    const token = localStorage.getItem("access_token");

    // 1. Fetch members
    const resUsers = await fetch("http://localhost:8000/api/min-member/");
    if (!resUsers.ok) throw new Error("Failed to fetch members");

    const dataUsers = await resUsers.json();
    const usersIds = dataUsers.ids;

    // 2. Prepare FormData
    const formData = new FormData();
    formData.append("status", newStatus);

    usersIds.forEach((userId) => {
      formData.append("assigned_members", userId);
    });

    // 3. Send update
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