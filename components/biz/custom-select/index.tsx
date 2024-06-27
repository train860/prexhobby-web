
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

interface Props {
    id: string;
    className?: string;
    placeholder?: string;
    options: { value: string | number, label: string }[];
    value?: string | undefined;
    defaultValue?: string | undefined;
    onChange?: (value: string) => void;
}

const CustomSelect = React.forwardRef<HTMLDivElement, Props>(({ id, options, placeholder, className, value,defaultValue, onChange,...rest }, ref) => {
    //console.log('CustomSelect', rest,value,defaultValue,onChange)
    return (
        <Select onValueChange={onChange} value={String(value) || undefined} defaultValue={defaultValue}>
            <SelectTrigger id={id} aria-label={placeholder}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className={className}>
                {
                    options.map((option) => (
                        <SelectItem key={option.value} value={String(option.value)}>{option.label}</SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
    )
});
CustomSelect.displayName = "CustomSelect";
export default CustomSelect;