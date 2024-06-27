import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import CustomCard from "../custom-card";

export type PageLayout = {
    type: 'table' | 'grid'
    className?: string
    gap?: number
    columns?: {
        size: number
        className?: string
    }[]
}

interface PageProps {
    children: React.ReactNode;
    layout?: PageLayout;
    loading?: boolean;
    className?: string;
    title?: string;
    subTitle?: string;
    back?: boolean
    titleExtra?: React.ReactNode;
    titleNode?: React.ReactNode;
    headerButtons?: React.ReactNode[];
}
export default function Page({ back = false, className, children, headerButtons, title, titleExtra, layout = {
    type: 'table',
}, ...props }: PageProps) {
    const router = useRouter();
    const renderHeaderLoading = () => {
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-4">
                    {back && <div className="bg-gray-200 h-7 w-7 rounded"></div>
                    }
                    <div className="h-5 bg-gray-200 rounded w-40"></div>
                    {
                        titleExtra
                    }
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        {
                            headerButtons?.map((button, index) => (
                                <React.Fragment key={index}>
                                    <div className="bg-gray-200 w-16 h-7 rounded"></div>
                                </React.Fragment>
                            ))
                        }
                    </div>
                </div>
                {props.subTitle && <p className="text-muted-foreground">
                    {props.subTitle}
                </p>}
            </div>
        )

    }
    const renderContentLoading = () => {
        if (layout.type === 'table') {
            return ""
        }

        return (
            <div className={`${layout.className}`}>
                {
                    layout.columns?.map((v, index) => {
                        return (
                            <div key={index} className={`animate-pulse ${v.className}`}>

                                {
                                    Array(v.size).fill(0).map((_, index) => {
                                        return (
                                            <CustomCard key={index} wrapClassName={
                                                {
                                                    content: "flex-1 space-y-2"
                                                }
                                            }>
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                            </CustomCard>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    return (
        <div className={cn("max-w-[64rem] flex-1 auto-rows-max space-y-4 w-full", className)}>
            {props.loading ? renderHeaderLoading() :
                <div className="w-full space-y-2">
                    <div className="flex items-center gap-4">
                        {back && <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() =>
                            router.back()
                        }>
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Button>
                        }
                        <h1 className=" flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                            {title}
                        </h1>
                        {
                            titleExtra
                        }
                        <div className="hidden items-center gap-2 md:ml-auto md:flex">
                            {
                                headerButtons?.map((button, index) => (
                                    <React.Fragment key={index}>
                                        {button}
                                    </React.Fragment>
                                ))
                            }
                        </div>
                    </div>
                    {props.subTitle && <p className="text-muted-foreground">
                        {props.subTitle}
                    </p>}
                </div>
            }
            {
                props.loading ? renderContentLoading() : children
            }
        </div>
    )
}