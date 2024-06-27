import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
    children?: React.ReactNode;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    className?: string;
    wrapClassName?: {
        header?: string;
        content?: string;
    }
}

export default function CustomCard({ title, description, children, className, wrapClassName }: Props) {
    return (
        <Card className={className}>
            {(title || description) && <CardHeader className={wrapClassName?.header}>
                {title && <CardTitle>{title}</CardTitle>}
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>}
            <CardContent className={wrapClassName?.content}>
                {children}
            </CardContent>
        </Card>
    )
}