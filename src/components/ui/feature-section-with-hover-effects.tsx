import { cn } from "@/lib/utils";
import {
  IconVideo,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandTiktok,
  IconSparkles,
  IconUsers,
  IconTrendingUp,
  IconRocket,
} from "@tabler/icons-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Video Content Creation",
      description:
        "High-converting video advertisements crafted by professionals with 500M+ organic views.",
      icon: <IconVideo />,
    },
    {
      title: "Instagram Assets",
      description:
        "Eye-catching Instagram posts, stories, and reels that drive engagement and conversions.",
      icon: <IconBrandInstagram />,
    },
    {
      title: "YouTube Content",
      description:
        "Professional YouTube videos, thumbnails, and channel assets that capture attention.",
      icon: <IconBrandYoutube />,
    },
    {
      title: "TikTok Virals",
      description: "Trending TikTok content designed to go viral and reach millions.",
      icon: <IconBrandTiktok />,
    },
    {
      title: "AI-Powered Producer Agent",
      description: "Our proprietary tool that accelerates content creation with artificial intelligence.",
      icon: <IconSparkles />,
    },
    {
      title: "Expert Team Access",
      description:
        "Work directly with our team of content creators and marketing professionals.",
      icon: <IconUsers />,
    },
    {
      title: "Proven Results",
      description:
        "Track record of delivering content that generates real business growth and ROI.",
      icon: <IconTrendingUp />,
    },
    {
      title: "Scale Your Brand",
      description: "From concept to viral content - we help you scale your creative output exponentially.",
      icon: <IconRocket />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l border-neutral-800",
        index < 4 && "lg:border-b border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-700 group-hover/feature:bg-red-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-white">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};