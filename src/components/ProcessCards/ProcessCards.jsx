"use client";
import "./ProcessCards.css";
import { useRef } from "react";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ProcessCards = () => {
  const processCardsData = [
    {
      index: "01",
      title: "Technology",
      subtitle: "The Architecture",
      image: "/images/process/process_001.jpeg",
      description:
        "Web Personalisation · UI/UX · Shopify Specialisation · E-commerce Ecosystems · Email Marketing · Automations · Chatbots",
      oneLiner:
        "Web experiences that adapt to user behaviour. Digital journeys that feel intuitive, elegant, and conversion-led. Systems that work silently to drive efficiency and revenue.",
    },
    {
      index: "02",
      title: "Brand",
      subtitle: "The Masterpiece",
      image: "/images/process/process_002.jpeg",
      description:
        "Social Media Marketing · Content & Copywriting · Graphic Design & Illustration · Editing & Animation · Film Production · Campaign Planning · Print, OOH, Mainline · Brand Launch & Rebranding",
      oneLiner:
        "Crafting digital narratives that build visibility, community, and cultural relevance. Visual identities that communicate personality with clarity and distinction.",
    },
    {
      index: "03",
      title: "Media",
      subtitle: "The Amplifier",
      image: "/images/process/process_003.jpeg",
      description:
        "Media Planning · Performance Marketing · Google Ads · YouTube Marketing · LinkedIn Marketing",
      oneLiner:
        "Data-driven acquisition strategies designed to convert attention into revenue. Allocating budgets intelligently to maximise reach, efficiency, and return.",
    },
  ];

  const cardRefs = useRef([]);

  useGSAP(() => {
    const cards = cardRefs.current.filter(Boolean);

    cards.forEach((card, index) => {
      if (index < cards.length - 1) {
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: cards[cards.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
        });

        ScrollTrigger.create({
          trigger: cards[index + 1],
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            const progress = self.progress;
            const scale = 1 - progress * 0.25;
            const rotation = (index % 2 === 0 ? 5 : -5) * progress;

            card.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
            card.style.setProperty("--after-opacity", progress);
          },
        });
      }
    });
  }, []);

  return (
    <div className="process-cards">
      {processCardsData.map((cardData, index) => (
        <div
          key={index}
          className="process-card"
          ref={(el) => (cardRefs.current[index] = el)}
        >
          <div className="process-card-index">
            <h1>{cardData.index}</h1>
          </div>
          <div className="process-card-content">
            <div className="process-card-content-wrapper">
              <h1 className="process-card-header">{cardData.title}</h1>

              <div className="process-card-img">
                <img src={cardData.image} alt="" loading="lazy" />
              </div>

              <div className="process-card-copy">
                <div className="process-card-copy-title">
                  <p className="caps">({cardData.subtitle})</p>
                </div>
                <div className="process-card-copy-description">
                  <p>{cardData.oneLiner}</p>
                  <p className="sm" style={{ marginTop: "1rem", opacity: 0.6 }}>
                    {cardData.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcessCards;
