"use client";
import "./studio.css";

import WhoWeAre from "@/components/WhoWeAre/WhoWeAre";
import ProcessCards from "@/components/ProcessCards/ProcessCards";
import BtnLink from "@/components/BtnLink/BtnLink";
import Footer from "@/components/Footer/Footer";

const page = () => {
  return (
    <>
      <div className="studio">
        <section className="studio-hero">
          <h1 className="caps">Wu</h1>
        </section>

        <section className="studio-hero-img">
          <div className="studio-hero-img-wrapper">
            <img src="/images/studio/hero.jpeg" alt="" />
          </div>
        </section>

        <section className="studio-header">
          <div className="studio-header-copy">
            <h2>
              At Wu Wei Studio, we approach every project with quiet focus.
              Through close collaboration and considered process, we build
              digital work that reflects both the needs of our clients and the
              values of our practice.
            </h2>
          </div>
        </section>

        <WhoWeAre />

        <section className="mission-intro">
          <div className="mission-intro-col-sm"></div>
          <div className="mission-intro-col-lg">
            <div className="mission-intro-copy">
              <h3>
                We are a digital studio dedicated to creating clear and
                purposeful online experiences. Our work is rooted in structure,
                guided by systems, and shaped through close collaboration.
              </h3>

              <h3>
                With a focus on design and development, we build scalable
                solutions that reflect quiet precision and long-term value.
                Every project is an exercise in restraint, intention, and
                technical care.
              </h3>

              <div className="mission-link">
                <BtnLink route="/work" label="View Work" dark />
              </div>
            </div>
          </div>
        </section>

        <ProcessCards />

        <section className="recognition">
          <div className="recognition-copy">
            <p className="sm">(Recognition)</p>

            <h2>
              Our work has been recognized by digital platforms and design
              communities for its clarity, consistency, and attention to detail.
              We focus on building systems that go beyond visuals experiences.
            </h2>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default page;
