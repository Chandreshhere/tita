"use client";
import "./studio.css";

import WhoWeAre from "@/components/WhoWeAre/WhoWeAre";
import ProcessCards from "@/components/ProcessCards/ProcessCards";

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
              At OH Architecture, we take a collaborative approach. Whether
              we’re working in the studio or alongside our clients and
              partnerws, it’s this shared process that helps us create work that
              reflects your vision and ours.
            </h2>
          </div>
        </section>

        <WhoWeAre />

        <section className="mission-intro">
          <div className="mission-intro-col-sm"></div>
          <div className="mission-intro-col-lg">
            <div className="mission-intro-copy">
              <h3>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rerum
                quod magnam iste a obcaecati asperiores officia, minus vero, est
                accusantium, doloribus molestiae ad at. Eaque amet minus aliquam
                vitae quod.
              </h3>

              <h3>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe
                pariatur deleniti nostrum modi incidunt! Quam?
              </h3>

              <div className="mission-link">
                <p className="sm caps mono">Live Demo</p>
              </div>
            </div>
          </div>
        </section>

        <ProcessCards />

        <section className="recognition">
          <div className="recognition-copy">
            <p className="caps">(Recognition)</p>

            <h2>
              At OH Architecture, we take a collaborative approach. Whether
              we’re working in the studio or alongside our clients and
              partnerws, it’s this shared process that helps us create work that
              reflects your vision and ours.
            </h2>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default page;
