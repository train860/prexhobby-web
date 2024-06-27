import { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "../../ui/form"
import React from "react"

export default function FormItemWrap({
    name,
    label,
    description,
    form,
    children,
    className,
    showErrorMessage = true,
    onErrorMessage,
}: {
    name: string
    label?: string
    description?: string
    children: React.ReactNode
    form?: UseFormReturn
    showErrorMessage?: boolean
    onErrorMessage?: (formMessageId: string, error: any) => void
    className?: string
}) {
    //注意：FormControl，只接受一个子元素，所有需要<></>，否则元素不显示
    return (
        <FormField
            control={form?.control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <>
                            {React.Children.map(children, (child) => {
                                if (React.isValidElement(child)) {
                                    return React.cloneElement(child, { ...field, ...child.props });
                                }
                                return null;
                            })}</>
                    </FormControl>
                    {description && <FormDescription>
                        {description}
                    </FormDescription>
                    }
                    <FormMessage show={showErrorMessage} onErrorMessage={onErrorMessage}/>
                </FormItem>
            )}
        />
    )
}