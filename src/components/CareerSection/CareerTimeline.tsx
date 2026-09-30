import { useEffect, useState } from "react";
import { ScrollTimeline } from "../lightswind/scroll-timeline";
import { Briefcase, Award, Users, Globe } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

type CareerEvent = {
  _id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  icon: "globe" | "briefcase" | "award" | "users";
  order: number;
};

const iconMap = {
  globe: <Globe className="h-4 w-4 mr-2 text-primary" />,
  briefcase: <Briefcase className="h-4 w-4 mr-2 text-primary" />,
  award: <Award className="h-4 w-4 mr-2 text-primary" />,
  users: <Users className="h-4 w-4 mr-2 text-primary" />,
};

export const CareerTimeline = () => {
  const [careerEvents, setCareerEvents] = useState<CareerEvent[]>([]);

  useEffect(() => {
    const loadCareer = async () => {
      try {
        const response = await fetch(`${API}/career`);

        if (!response.ok) {
          throw new Error("Failed to fetch career data");
        }

        const data = await response.json();

        setCareerEvents(
          data.sort(
            (a: CareerEvent, b: CareerEvent) =>
              (a.order ?? 0) - (b.order ?? 0)
          )
        );
      } catch (error) {
        console.error("Failed to load career data:", error);
      }
    };

    loadCareer();
  }, []);

  return (
    <div id="career">
      <ScrollTimeline
        events={careerEvents.map((event) => ({
          ...event,
          icon: iconMap[event.icon as keyof typeof iconMap],
        }))}
        title="My Journey"
        subtitle="Learning, building, researching, and growing through technology"
        animationOrder="staggered"
        cardAlignment="alternating"
        cardVariant="elevated"
        parallaxIntensity={0.15}
        revealAnimation="fade"
        progressIndicator={true}
        lineColor="bg-primary/20"
        activeColor="bg-primary"
        progressLineWidth={3}
        progressLineCap="round"
      />
    </div>
  );
};