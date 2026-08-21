import Image from "next/image";
import { asset } from "@/lib/assets";
import { featuredProjects } from "@/lib/content";
import { ProjectMetrics } from "@/components/ProjectMetrics";

export function FeaturedProjects() {
  return (
    <section className="section featured-projects-section" id="projektbeispiele" aria-labelledby="featured-projects-title">
      <div className="shell">
        <header className="featured-projects-heading reveal">
          <div>
            <p className="eyebrow">Projektbeteiligungen</p>
            <h2 id="featured-projects-title">Definierte Leistungspakete.<br />Als Teil größerer Projekte.</h2>
          </div>
        </header>

        <div className="featured-projects-list">
          {featuredProjects.map((project) => (
            <article className="featured-project reveal" key={project.id}>
              <div className="featured-project-media">
                <div className="featured-project-lead">
                  <Image
                    src={asset(project.leadImage.src)}
                    alt={project.leadImage.alt}
                    fill
                    sizes="(max-width: 560px) 60vw, (max-width: 1050px) 62vw, 500px"
                  />
                </div>
                {project.detailImages.map((image) => (
                  <div className={`featured-project-detail${image.fit === "contain" ? " featured-project-detail-contain" : ""}`} key={image.src}>
                    <Image
                      src={asset(image.src)}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 560px) 32vw, (max-width: 1050px) 30vw, 270px"
                    />
                  </div>
                ))}
              </div>

              <div className="featured-project-copy">
                <div className="featured-project-copy-main">
                  <p className="featured-project-category">{project.category}</p>
                  <h3>{project.title}</h3>
                </div>
                <p className="featured-project-description">{project.description}</p>
                <div className="featured-project-copy-facts">
                  <ProjectMetrics items={project.metrics.items} title={project.title} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
