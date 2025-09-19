"use client";
import { InView } from "@/components/ui/in-view";
import { motion } from "framer-motion";

// Media items from your existing data
const mediaItems = [
  {
    id: 1,
    type: 'video',
    title: 'Brand Identity Campaign',
    desc: 'Motion Graphics',
    url: 'https://drive.google.com/file/d/1CqaNsaC4Egi1CfNXciMXHDGdOrMYKzl_/view'
  },
  {
    id: 2,
    type: 'video',
    title: 'Product Showcase',
    desc: 'Commercial',
    url: 'https://drive.google.com/file/d/1TME3qng8CjN9o3KvGrK_eqOjIQC3qrOI/view'
  },
  {
    id: 3,
    type: 'video',
    title: 'Creative Campaign',
    desc: 'Advertisement',
    url: 'https://drive.google.com/file/d/1l8AaHKpREjuRd7wVkSzUq8pNJObqtV-d/view'
  },
  {
    id: 4,
    type: 'video',
    title: 'Digital Content',
    desc: 'Social Media',
    url: 'https://drive.google.com/file/d/1JucX4T-T80rffvRcLsl7nxlFZTOcrs7K/view'
  },
  {
    id: 5,
    type: 'video',
    title: 'Visual Storytelling',
    desc: 'Narrative',
    url: 'https://drive.google.com/file/d/1ABgQJcREV3Zcbdz3u2CsIbfBbpbWiSn1/view'
  },
  {
    id: 6,
    type: 'video',
    title: 'Motion Design',
    desc: 'Animation',
    url: 'https://drive.google.com/file/d/1vCVMguU8AcCz5FbNpS-e7BnnvXjeeoZd/view'
  },
  {
    id: 7,
    type: 'video',
    title: 'Brand Film',
    desc: 'Corporate',
    url: 'https://drive.google.com/file/d/1UGJi-guqIndz1WcdUh9fv1MP66POKmYF/view'
  },
  {
    id: 8,
    type: 'video',
    title: 'Creative Vision',
    desc: 'Concept',
    url: 'https://drive.google.com/file/d/1giD9v_AFAYW2WhkxQI_v_moBo-zhcPIr/view'
  },
  {
    id: 9,
    type: 'video',
    title: 'Digital Art',
    desc: 'Experimental',
    url: 'https://drive.google.com/file/d/1g2_Qmu2N6gAxrsm03o6o2ETN2Txniitc/view'
  },
  {
    id: 10,
    type: 'video',
    title: 'Content Strategy',
    desc: 'Marketing',
    url: 'https://drive.google.com/file/d/10jA7uXnB6vlA-ptak9pHCYcp_3rehCN6/view'
  },
  {
    id: 11,
    type: 'video',
    title: 'Visual Identity',
    desc: 'Branding',
    url: 'https://drive.google.com/file/d/13SPqJZONYD5lv7OdhdVVAXYMdMU-X0qb/view'
  },
  {
    id: 12,
    type: 'video',
    title: 'Media Production',
    desc: 'Production',
    url: 'https://drive.google.com/file/d/1zpk-L96otnzqF6wzUQVvZhGudJtu1npM/view'
  }
];

interface MediaItemProps {
  item: typeof mediaItems[0];
  index: number;
}

function MediaItem({ item, index }: MediaItemProps) {
  const handleClick = () => {
    window.open(item.url, '_blank');
  };

  // Beautiful gradient combinations
  const gradients = [
    'bg-gradient-to-br from-red-500 to-orange-500',
    'bg-gradient-to-br from-purple-500 to-pink-500', 
    'bg-gradient-to-br from-blue-500 to-cyan-500',
    'bg-gradient-to-br from-green-500 to-teal-500',
    'bg-gradient-to-br from-yellow-500 to-orange-500',
    'bg-gradient-to-br from-indigo-500 to-purple-500',
    'bg-gradient-to-br from-pink-500 to-rose-500',
    'bg-gradient-to-br from-cyan-500 to-blue-500',
    'bg-gradient-to-br from-teal-500 to-green-500',
    'bg-gradient-to-br from-orange-500 to-red-500',
    'bg-gradient-to-br from-violet-500 to-purple-500',
    'bg-gradient-to-br from-emerald-500 to-teal-500'
  ];

  const gradient = gradients[index % gradients.length];

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
        visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
      }}
      className="w-full h-64 mb-4 group cursor-pointer"
      onClick={handleClick}
    >
      <div className={`relative w-full h-full rounded-xl ${gradient} overflow-hidden`}>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="text-center">
            {/* Video icon */}
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-white/90 text-sm mb-3">{item.desc}</p>
            <span className="text-white/70 text-xs bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              Click to view
            </span>
          </div>
        </div>
        
        {/* Play button overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function InViewMediaGrid() {
  return (
    <section className="min-h-screen w-full bg-black text-white">
      <div className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light mb-8 text-white">Our Work</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-light">
            Explore our portfolio of creative campaigns and digital content that have captivated audiences worldwide.
          </p>
        </div>

        <div className="flex items-center justify-center">
          <InView
            viewOptions={{ once: true, margin: "0px 0px -150px 0px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl">
              {mediaItems.map((item, index) => (
                <MediaItem key={item.id} item={item} index={index} />
              ))}
            </div>
          </InView>
        </div>
      </div>
    </section>
  );
}

export default InViewMediaGrid;