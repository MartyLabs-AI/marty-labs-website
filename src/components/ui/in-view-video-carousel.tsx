"use client";
import { InView } from "@/components/ui/in-view";
import { motion } from "framer-motion";

const videoAssets = [
  {
    id: 1,
    title: 'Brand Identity Campaign',
    desc: 'Motion Graphics',
    url: 'https://drive.google.com/file/d/1CqaNsaC4Egi1CfNXciMXHDGdOrMYKzl_/view'
  },
  {
    id: 2,
    title: 'Product Showcase',
    desc: 'Commercial',
    url: 'https://drive.google.com/file/d/1TME3qng8CjN9o3KvGrK_eqOjIQC3qrOI/view'
  },
  {
    id: 3,
    title: 'Creative Campaign',
    desc: 'Advertisement',
    url: 'https://drive.google.com/file/d/1l8AaHKpREjuRd7wVkSzUq8pNJObqtV-d/view'
  },
  {
    id: 4,
    title: 'Digital Content',
    desc: 'Social Media',
    url: 'https://drive.google.com/file/d/1JucX4T-T80rffvRcLsl7nxlFZTOcrs7K/view'
  },
  {
    id: 5,
    title: 'Visual Storytelling',
    desc: 'Narrative',
    url: 'https://drive.google.com/file/d/1ABgQJcREV3Zcbdz3u2CsIbfBbpbWiSn1/view'
  },
  {
    id: 6,
    title: 'Motion Design',
    desc: 'Animation',
    url: 'https://drive.google.com/file/d/1vCVMguU8AcCz5FbNpS-e7BnnvXjeeoZd/view'
  },
  {
    id: 7,
    title: 'Brand Film',
    desc: 'Corporate',
    url: 'https://drive.google.com/file/d/1UGJi-guqIndz1WcdUh9fv1MP66POKmYF/view'
  },
  {
    id: 8,
    title: 'Creative Vision',
    desc: 'Concept',
    url: 'https://drive.google.com/file/d/1giD9v_AFAYW2WhkxQI_v_moBo-zhcPIr/view'
  },
  {
    id: 9,
    title: 'Digital Art',
    desc: 'Experimental',
    url: 'https://drive.google.com/file/d/1g2_Qmu2N6gAxrsm03o6o2ETN2Txniitc/view'
  },
  {
    id: 10,
    title: 'Content Strategy',
    desc: 'Marketing',
    url: 'https://drive.google.com/file/d/10jA7uXnB6vlA-ptak9pHCYcp_3rehCN6/view'
  },
  {
    id: 11,
    title: 'Visual Identity',
    desc: 'Branding',
    url: 'https://drive.google.com/file/d/13SPqJZONYD5lv7OdhdVVAXYMdMU-X0qb/view'
  },
  {
    id: 12,
    title: 'Media Production',
    desc: 'Production',
    url: 'https://drive.google.com/file/d/1zpk-L96otnzqF6wzUQVvZhGudJtu1npM/view'
  }
];

function InViewVideoCarousel() {
  return (
    <div className="h-[80vh] w-full overflow-y-auto overflow-x-hidden bg-black">
      <div className="mb-[50vh] mt-[50vh] py-12 text-center text-sm text-white">Scroll down to see our work</div>
      <div className="flex h-[1200px] items-end justify-center pb-12">
        <InView
          viewOptions={{ once: true, margin: "0px 0px -250px 0px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.09 },
            },
          }}
        >
          <div className="columns-2 gap-4 px-8 sm:columns-3">
            {videoAssets.map((video, index) => {
              // Create gradient backgrounds for video placeholders
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
                  key={video.id}
                  className="mb-4 cursor-pointer group"
                  onClick={() => window.open(video.url, '_blank')}
                >
                  <div className={`w-full h-64 rounded-lg ${gradient} relative overflow-hidden flex items-center justify-center`}>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                    
                    {/* Content */}
                    <div className="relative text-center p-4">
                      {/* Video icon */}
                      <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-1">{video.title}</h3>
                      <p className="text-white/80 text-xs">{video.desc}</p>
                    </div>
                    
                    {/* Play button on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
                        <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </InView>
      </div>
    </div>
  );
}

export default InViewVideoCarousel;