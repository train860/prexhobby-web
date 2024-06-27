import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
interface CustomAlterDialogProps {
    open: boolean
    title?: string
    description?: string
    cancelText?: string
    confirmText?: string
    confirmLoading?: boolean
    onCancel?: () => void
    onConfirm?: () => void
}
export function CustomAlterDialog({
    open,
    title,
    description,
    cancelText,
    confirmText,
    confirmLoading,
    onCancel,
    onConfirm,
}: CustomAlterDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={(open) => {
            if (!open) {
                onCancel?.()
            }
        }}>
            <AlertDialogContent>
                {(title || description) && <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                }
                <div className="flex justify-end items-center gap-2">
                    <Button variant="outline" onClick={onCancel}>{cancelText || 'Cancel'}</Button>
                    <Button onClick={onConfirm} loading={confirmLoading}>{confirmText || 'Ok'}</Button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
