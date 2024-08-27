'use client';

import React from 'react';
import Sobers from './Sobers';
import Image from 'next/image';
import backgroundImage from '@/assets/5206676.jpg';

const Page: React.FC = () => {
    return (
        <main className="relative flex w-full min-w-0 gap-5 justify-center items-center h-screen">
            {/* Background Image */}
            <div className="absolute top-0 left-0 w-full h-full">
                <Image
                    src={backgroundImage}
                    alt="Background"
                    fill // Use the 'fill' prop instead of 'layout="fill"'
                    className="object-cover" // Apply object-fit as a CSS class
                    quality={100}
                    priority
                />
            </div>

            {/* Content Section */}
            <div className="relative z-10 w-full max-w-md">
                <div className="rounded-2xl bg-white p-5 shadow-lg bg-opacity-70">
                    <h1 className="text-center text-2xl font-bold mb-5 text-blue-800">
                        You&apos;ve been sober since:
                    </h1>
                    <Sobers />
                </div>  
            </div>
        </main>
    );
};

export default Page;