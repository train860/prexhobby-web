import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomDialogProps {
    open?: boolean
    title?: string
    children?: React.ReactNode
    footer?: React.ReactNode
    className?: string
    onClose?: () => void
    onConfirm?: () => void
}
export default function CustomDialog({
    open,
    className,
    title,
    children,
    footer,
    onClose,
    onConfirm,
}: CustomDialogProps) {
    return (
        <Dialog open={open} onOpenChange={(v) => {
            if (!v) {
                onClose?.()
            }
        }}>
            <DialogContent className={cn("", className)}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="">
                    {children}
                </div>
                <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" size={'sm'}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={onConfirm} type="button" size={'sm'}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}