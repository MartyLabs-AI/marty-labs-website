'use client';

import { BlurredInfiniteSlider } from './blurred-infinite-slider';
import { useState, useEffect } from 'react';

const LOGOS = [
    { src: "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/image%2019%201%20(4).png", alt: "Partner Logo 1", mobileHeight: 16, desktopHeight: 24 },
    { src: "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/image%2021%201%20(3).png", alt: "Partner Logo 2", mobileHeight: 14, desktopHeight: 20 },
    { src: "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/image%2022%201%20(3).png", alt: "Partner Logo 3", mobileHeight: 14, desktopHeight: 20 },
    { src: "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/image%2023%20(3).png", alt: "Partner Logo 4", mobileHeight: 16, desktopHeight: 24 },
    { src: "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/image-removebg-preview%20(68)%201%20(2).png", alt: "Partner Logo 5", mobileHeight: 18, desktopHeight: 28 },
];

export default function MartyLabsLogoCloud() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    return (
        <section className="bg-black overflow-hidden py-0 w-full">
            <div className="m-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-6">
                <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0">
                    <div className="flex-shrink-0 text-center md:text-right md:max-w-44 md:border-r md:border-gray-600 md:pr-6">
                        <p className="text-xs sm:text-sm text-gray-300">
                            Powering the best teams
                        </p>
                    </div>
                    <div className="w-full md:w-auto md:flex-1 md:pl-6">
                        <BlurredInfiniteSlider
                            speedOnHover={20}
                            speed={40}
                            gap={isMobile ? 60 : 112}
                            fadeWidth={isMobile ? 40 : 80}
                        >
                            {LOGOS.map((logo, index) => (
                                <div key={`${logo.src}-${index}`} className="flex items-center justify-center">
                                    <img
                                        className="object-contain w-auto"
                                        src={logo.src}
                                        alt={logo.alt}
                                        style={{ 
                                            height: isMobile 
                                                ? `${logo.mobileHeight}px` 
                                                : `${logo.desktopHeight}px`,
                                            maxWidth: isMobile ? '80px' : '120px'
                                        }}
                                    />
                                </div>
                            ))}
                        </BlurredInfiniteSlider>
                    </div>
                </div>
            </div>
        </section>
    );
}