import { motion } from 'framer-motion';
import { VideoTile, TextTile, CentralTextTile, ImageTile } from './Tiles';

// Video URLs in placement order: Top left → right → down → bottom right → left → bottom → top
const videoSources = [
  "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/37216.mp4", // 0 - Top left (vertical)
  "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/35678.mp4", // 1 - Top row, 2nd position
  "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/b451a22c-c31b-4db1-8e5a-97e53d88efa5.mp4", // 2 - Top row, 3rd position
  "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/tmpbpshxo_a.mp4", // 3 - Top row, 4th position  
  "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/tmpc3w2kei2.mp4", // 4 - Top right position
  "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/tmpxn6kngk5.mp4", // 5 - Right column, 2nd row
  "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/1%20-%202025-09-18T032627.020.mp4", // 6 - Right column (vertical)
  "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/35706.mp4", // 7 - Bottom row, 4th position
  "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/36539.mp4", // 8 - Bottom row, 3rd position
  "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/f2d1663e-79a3-4b38-baa9-d00d69d756bd.mp4", // 9 - Bottom row, 2nd position
  "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/10ff999e-3011-4565-a263-802df7dae8ad%20(1).mp4", // 10 - Bottom left
  "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/tmpcgb5kuqk.mp4", // 11 - Left column, 3rd row
];

const tileAnimation = (delay) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: delay * 0.08, ease: "easeOut" },
});

export const HeroGrid = () => {
  return (
    <section id="video-grid-section" className="min-h-screen flex items-center justify-center bg-black p-2 sm:p-4 md:p-6 lg:p-8">
      
      {/* Mobile Layout - 2 columns, mostly vertical */}
      <div className="md:hidden w-full px-4 space-y-4 max-w-sm mx-auto">
        <motion.div {...tileAnimation(0)}>
          <VideoTile src={videoSources[0]} aspectRatio="9/16" className="h-96" />
        </motion.div>
        
        <motion.div {...tileAnimation(1)}>
          <CentralTextTile />
        </motion.div>
        
        <div className="grid grid-cols-2 gap-3">
          <motion.div {...tileAnimation(2)}>
            <VideoTile src={videoSources[1]} aspectRatio="4/3" />
          </motion.div>
          <motion.div {...tileAnimation(3)}>
            <VideoTile src={videoSources[2]} aspectRatio="4/3" />
          </motion.div>
        </div>
        
        <motion.div {...tileAnimation(4)}>
          <VideoTile src={videoSources[3]} aspectRatio="16/9" />
        </motion.div>
        
        <div className="grid grid-cols-2 gap-3">
          <motion.div {...tileAnimation(5)}>
            <VideoTile src={videoSources[4]} aspectRatio="4/3" />
          </motion.div>
          <motion.div {...tileAnimation(6)}>
            <VideoTile src={videoSources[5]} aspectRatio="4/3" />
          </motion.div>
        </div>
      </div>

      {/* Tablet Layout - 3 columns, 6 rows */}
      <div 
        className="hidden md:grid lg:hidden gap-3 w-full" 
        style={{ 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gridTemplateRows: "repeat(6, 180px)", 
          maxWidth: "900px", 
          margin: "0 auto" 
        }}
      >
        <motion.div style={{ gridArea: "1 / 1 / 3 / 2" }} {...tileAnimation(0)}>
          <VideoTile src={videoSources[0]} aspectRatio="9/16" className="h-full" />
        </motion.div>
        
        <motion.div style={{ gridArea: "1 / 2 / 2 / 3" }} {...tileAnimation(1)}>
          <VideoTile src={videoSources[1]} aspectRatio="4/3" />
        </motion.div>
        
        <motion.div style={{ gridArea: "1 / 3 / 2 / 4" }} {...tileAnimation(2)}>
          <VideoTile src={videoSources[2]} aspectRatio="4/3" />
        </motion.div>
        
        <motion.div style={{ gridArea: "2 / 2 / 4 / 4" }} {...tileAnimation(3)}>
          <CentralTextTile className="h-full" />
        </motion.div>
        
        <motion.div style={{ gridArea: "3 / 1 / 4 / 2" }} {...tileAnimation(4)}>
          <VideoTile src={videoSources[3]} aspectRatio="4/3" />
        </motion.div>
        
        <motion.div style={{ gridArea: "4 / 1 / 5 / 2" }} {...tileAnimation(5)}>
          <VideoTile src={videoSources[4]} aspectRatio="4/3" />
        </motion.div>
        
        <motion.div style={{ gridArea: "4 / 2 / 5 / 3" }} {...tileAnimation(6)}>
          <VideoTile src={videoSources[5]} aspectRatio="4/3" />
        </motion.div>
        
        <motion.div style={{ gridArea: "4 / 3 / 6 / 4" }} {...tileAnimation(7)}>
          <VideoTile src={videoSources[6]} aspectRatio="9/16" className="h-full" />
        </motion.div>
        
        <motion.div style={{ gridArea: "5 / 1 / 6 / 2" }} {...tileAnimation(8)}>
          <VideoTile src={videoSources[7]} aspectRatio="4/3" />
        </motion.div>
        
        <motion.div style={{ gridArea: "5 / 2 / 6 / 3" }} {...tileAnimation(9)}>
          <VideoTile src={videoSources[8]} aspectRatio="4/3" />
        </motion.div>
        
        <motion.div style={{ gridArea: "6 / 1 / 7 / 2" }} {...tileAnimation(10)}>
          <VideoTile src={videoSources[9]} aspectRatio="4/3" />
        </motion.div>
        
        <motion.div style={{ gridArea: "6 / 2 / 7 / 3" }} {...tileAnimation(11)}>
          <VideoTile src={videoSources[10]} aspectRatio="4/3" />
        </motion.div>
      </div>

      {/* Desktop Layout - 5 columns, 4 rows */}
      <div 
        className="hidden lg:grid gap-4 w-full" 
        style={{ 
          gridTemplateColumns: "repeat(5, 1fr)", 
          gridTemplateRows: "repeat(4, 200px)", 
          maxWidth: "1400px", 
          margin: "0 auto" 
        }}
      >
        {/* Top row - Left to Right (videos 0-4) */}
        <motion.div style={{ gridArea: "1 / 1 / 3 / 2" }} {...tileAnimation(0)}>
          <VideoTile src={videoSources[0]} aspectRatio="9/16" className="h-full" />
        </motion.div>
        
        <motion.div style={{ gridArea: "1 / 2 / 2 / 3" }} {...tileAnimation(1)}>
          <VideoTile src={videoSources[1]} aspectRatio="4/3" />
        </motion.div>
        
        <motion.div style={{ gridArea: "1 / 3 / 2 / 4" }} {...tileAnimation(2)}>
          <VideoTile src={videoSources[2]} aspectRatio="4/3" />
        </motion.div>
        
        <motion.div style={{ gridArea: "1 / 4 / 2 / 5" }} {...tileAnimation(3)}>
          <VideoTile src={videoSources[3]} aspectRatio="4/3" />
        </motion.div>
        
        <motion.div style={{ gridArea: "1 / 5 / 2 / 6" }} {...tileAnimation(4)}>
          <VideoTile src={videoSources[4]} aspectRatio="4/3" />
        </motion.div>

        {/* Right column going down (video 5) */}
        <motion.div style={{ gridArea: "2 / 5 / 3 / 6" }} {...tileAnimation(5)}>
          <VideoTile src={videoSources[5]} aspectRatio="4/3" />
        </motion.div>

        {/* Right tall video going down (video 6) */}
        <motion.div style={{ gridArea: "3 / 5 / 5 / 6" }} {...tileAnimation(6)}>
          <VideoTile src={videoSources[6]} aspectRatio="9/16" className="h-full" />
        </motion.div>

        {/* Bottom row - Right to Left (videos 7-10) */}
        <motion.div style={{ gridArea: "4 / 4 / 5 / 5" }} {...tileAnimation(7)}>
          <VideoTile src={videoSources[7]} aspectRatio="4/3" />
        </motion.div>
        
        <motion.div style={{ gridArea: "4 / 3 / 5 / 4" }} {...tileAnimation(8)}>
          <VideoTile src={videoSources[8]} aspectRatio="4/3" />
        </motion.div>
        
        <motion.div style={{ gridArea: "4 / 2 / 5 / 3" }} {...tileAnimation(9)}>
          <VideoTile src={videoSources[9]} aspectRatio="4/3" />
        </motion.div>
        
        <motion.div style={{ gridArea: "4 / 1 / 5 / 2" }} {...tileAnimation(10)}>
          <VideoTile src={videoSources[10]} aspectRatio="4/3" />
        </motion.div>

        {/* Left column going up (video 11) */}
        <motion.div style={{ gridArea: "3 / 1 / 4 / 2" }} {...tileAnimation(11)}>
          <VideoTile src={videoSources[11]} aspectRatio="4/3" />
        </motion.div>

        {/* Central text tile - spans the middle */}
        <motion.div style={{ gridArea: "2 / 2 / 4 / 5" }} {...tileAnimation(12)}>
          <CentralTextTile className="h-full" />
        </motion.div>
      </div>
    </section>
  );
};