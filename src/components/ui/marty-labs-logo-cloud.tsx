'use client';

import { BlurredInfiniteSlider } from './blurred-infinite-slider';

const LOGOS = [
    { src: "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/image%2019%201%20(4).png", alt: "Partner Logo 1", height: 24 },
    { src: "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/image%2021%201%20(3).png", alt: "Partner Logo 2", height: 20 },
    { src: "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/image%2022%201%20(3).png", alt: "Partner Logo 3", height: 20 },
    { src: "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/image%2023%20(3).png", alt: "Partner Logo 4", height: 24 },
    { src: "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/image-removebg-preview%20(68)%201%20(2).png", alt: "Partner Logo 5", height: 28 },
];

export default function MartyLabsLogoCloud() {
    return (
        <section className="bg-black overflow-hidden py-0 w-full">
            <div className="m-auto max-w-7xl px-6 py-6">
                <div className="flex flex-col items-center md:flex-row">
                    <div className="flex-shrink-0 text-center md:text-right md:max-w-44 md:border-r md:border-gray-600 md:pr-6">
                        <p className="text-sm text-gray-300">
                            Powering the best teams
                        </p>
                    </div>
                    <div className="w-full py-4 md:w-auto md:flex-1">
                        <BlurredInfiniteSlider
                            speedOnHover={20}
                            speed={40}
                            gap={112}
                            fadeWidth={80}
                        >
                            {LOGOS.map((logo, index) => (
                                <div key={`${logo.src}-${index}`} className="flex">
                                    <img
                                        className="mx-auto w-fit"
                                        src={logo.src}
                                        alt={logo.alt}
                                        style={{ height: `${logo.height}px` }}
                                        width="auto"
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