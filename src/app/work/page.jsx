"use client";
import "./work.css";
import { portfolio } from "./portfolio";

const page = () => {
  return (
    <div className="work">
      <div className="work-sidebar"></div>
      <div className="work-main">
        {portfolio.map((yearData, yearIndex) => (
          <div key={yearIndex} className="work-container">
            <div className="work-year-container">
              <h1 className="work-year">'{yearData.year.slice(-2)}</h1>
            </div>
            <div className="work-projects-container">
              {yearData.projects.map((project, projectIndex) => (
                <div key={projectIndex} className="work-project">
                  <div className="work-project-img">
                    <img src={project.img} alt={project.name} />
                  </div>
                  <div className="work-project-info">
                    <p className="sm work-project-info-name">{project.name}</p>
                    <p className="sm work-project-info-tags">{project.tags}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
