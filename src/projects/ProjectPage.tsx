import { useState, useEffect } from "react";
import type { Project } from "./Project";
import ProjectList from "./ProjectList"
import projectAPI from "./projectAPI";

function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      try {
        const data = await projectAPI.get(page);
        setError('');
        if (page === 1) {
          setProjects(data);
        } else {
          setProjects((projects) => [...projects, ...data]);
        }
      }
      catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, [page]);

  const handleMoreClick = () => {
    setPage((currentPage) => currentPage + 1);
  };

  const saveProject = (project: Project) => {
    let updatedProjects = projects.map((p: Project) => {
      return p.id === project.id ? project : p;
    })
    setProjects(updatedProjects);
  };

  return (
    <>
      <h1>Projects</h1>
      {error && error.length > 0 && (
        <div className="row">
          <div className="card large error">
            <section>
              <p>
                <span className="icon-alert inverse " />
                {error}
              </p>
            </section>
          </div>
        </div>
      )}
      <ProjectList projects={projects} onSave={saveProject} />
      {loading && (
        <div className="center-page">
          <span className="spinner primary" />
          <p>Loading...</p>
        </div>
      )}
      {!loading && !error && (
        <div className="row">
          <div className="col-sm-12">
            <div className="button-group fluid">
              <button className="button default" onClick={handleMoreClick}>
                More...
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProjectPage