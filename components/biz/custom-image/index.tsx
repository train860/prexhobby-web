import React, { useMemo } from "react";
import Image from "next/image";
import { ImageIcon } from "@radix-ui/react-icons";
const NEXT_PUBLIC_FILE_DOMAIN = process.env.NEXT_PUBLIC_FILE_DOMAIN;

interface CustomImageProps {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    className?: string;
}

export default function CustomImage({ src, alt = "", width, height, className }: CustomImageProps) {
    const domains = JSON.parse(NEXT_PUBLIC_FILE_DOMAIN);
    const url = useMemo(() => {
        if (!src) {
            return null;
        }
        if (src.includes('http://') || src.includes('https://')) {
            return src;
        }
        const list = src.split(',');
        const domain = domains[list[0]];
        if (!domain) {
            return src;
        }
        return `${domain}/${list[1]}`;
    }, [src]);

    const w = width || 80
    const h = height || w
    return (
        <div className={`flex rounded-lg overflow-hidden border border-[#f0f0f0]`} style={{
            width: w,
            height: h
        }}>
            {url ? <div className="relative m-1 flex-1">
                <Image src={url} alt={alt}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    style={{
                        objectFit: 'contain',
                    }} />
            </div> : <div className="relative m-1 flex-1 flex justify-center items-center"><ImageIcon color="#aaa"/></div>
            }
        </div>
    );
}