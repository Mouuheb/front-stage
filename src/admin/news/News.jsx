import React, { useEffect, useState } from "react";
import './new.css'

function News() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    fetchNews(page);
  }, [page]);

  const fetchNews = (page) => {
    setLoading(true)
    fetch(`http://localhost:8000/api/news/?page=${page}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setArticles(data.results);
                console.log(data.results)
                setLoading(false);
            })
            .catch(err => console.error(err));
  };

  return (
    loading === false ? (
    <div className="new-page-main">
      {/* 📰 Cards */}
      <div className="news-ov-flow">
      <div className="card-cnt">
        {articles.map((a, i) => (
          <div key={i} className="sg-card">
            <div className="text-cnt">
                <small>@{a.source}</small>
              <h3>{a.title}</h3>
              {/* <p>{a.description?.slice(0, 120)}...</p> */}

              

              <a href={a.link} target="_blank" rel="noreferrer">
                Read more →
              </a>
            </div>
            {a.image && (
            //   <img src={a.image}/>
            null
            )}
          </div>
        ))}
      </div>
      </div>
      <div className="main-cnt-txt">
        <h1>Bonjour </h1>
        <h1>Admin </h1>
      </div>

      {/* ⏭ Pagination */}
      {/* <div style={{ marginTop: "20px" }}>
        <button onClick={() => setPage(p => Math.max(p - 1, 1))}>
          Prev
        </button>
        <button onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div> */}
    </div>):
    (<div>loading</div>)
  );
}

export default News;