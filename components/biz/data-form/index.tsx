"use client"
import { useForm, FieldValues, DefaultValues } from "react-hook-form";
import { z, ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
} from "../../ui/form";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import FormItemWrap from "./form-item";
function getErrorElementPaths(errors:any, basePath = '') {
    let paths:string[] = [];

    // 递归遍历错误对象以构建名称路径
    Object.keys(errors).forEach(key => {
        const value = errors[key];
        const currentPath = basePath ? `${basePath}.${key}` : key;

        if (value instanceof Array) {
            value.forEach((item, index) => {
                paths = paths.concat(getErrorElementPaths(item, `${currentPath}[${index}]`));
            });
        } else if (value && typeof value === 'object' && value.message) {
            paths.push(currentPath);
        } else if (value && typeof value === 'object') {
            paths = paths.concat(getErrorElementPaths(value, currentPath));
        }
    });

    return paths;
}
export interface FormRef<T> {
    reset: (values: T) => void
    setValue: (name: string, value: any) => void
    getValue:(name:string)=>any
}
type Props<T extends FieldValues> = {
    queryKey: string;
    defaultValues?: DefaultValues<T>;
    showErrors?: boolean;
    schema: ZodSchema<T>;
    footer?: React.ReactNode;
    children: React.ReactNode;
    onSubmit?: (data: T) => void;
    onValuesChange?: (values: T) => void;
    onLoadingChange?: (key: string, loading: boolean) => void;
    onDataLoaded?: (data: T) => T | void;
    actions?: {
        submit?: null | ((values: T) => Promise<any>),
        fetch?: null | (() => Promise<any>),
    }
};

const DataForm = <T extends FieldValues>({
    queryKey,
    defaultValues,
    showErrors,
    schema,
    children,
    actions,
    onSubmit,
    onLoadingChange,
    onValuesChange,
    onDataLoaded,
}: Props<T>, ref: React.Ref<FormRef<T>> | null) => {
    const form = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues,
        shouldFocusError: false,
    });
    const [canFocus, setCanFocus] = useState(true)

    const onError = () => {
        setCanFocus(true)
    }
    const allValues = form.watch();
    useEffect(() => {
        if (form.formState.errors && canFocus) {
            // Sort inputs based on their position on the page. (the order will be based on validaton order otherwise)
            const errorPaths = getErrorElementPaths(form.formState.errors);
            const elements = errorPaths.map(path => document.getElementsByName(path)[0]).filter(el => !!el);
            elements.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

            if (elements.length > 0) {
                let errorElement = elements[0];
                errorElement.scrollIntoView({ behavior: "smooth", block: "center" }); // scrollIntoView options are not supported in Safari
                setTimeout(() => {
                    errorElement.focus({ preventScroll: true });
                }, 0);
                setCanFocus(false) // so the form doesn't suddenly jump to the next input that has error.
            }
        }
    }, [form.formState, canFocus]);
    useEffect(() => {
        loadData()
    }, [])
    useEffect(() => {
        onValuesChange?.(allValues);
    }, [allValues]);

    useImperativeHandle(ref, () => ({
        reset: (values) => {
            form.reset(values)
        },
        setValue: (name: string, value) => {
            form.setValue(name as any, value)
        },
        getValue:(name:string)=>{
            return form.getValues(name as any)
        }
    }))

    const loadData = () => {
        const action = actions?.fetch
        if (!action) {
            return;
        }
        onLoadingChange?.('fetch', true)
        action()?.then((res: any) => {
            if (!res || !res[queryKey]) {
                return;
            }
            const data = res[queryKey][0]
            setTimeout(() => {
                const newData = onDataLoaded?.(data)
                if (newData) {
                    form.reset({ ...newData })
                    return;
                }
                form.reset({ ...data })
            }, 0);
        }).finally(() => {
            setTimeout(() => {
                onLoadingChange?.('fetch', false)
            }, 300);

        })
    }
    const handleSubmit = (values: T) => {
        if (onSubmit) {
            return onSubmit(values);
        }

        const action = actions?.submit
        if (!action) {
            return;
        }
        onLoadingChange?.('submit', true)
        action?.(values)?.then((res) => {
            console.log(res)
        }).finally(() => {
            onLoadingChange?.('submit', false)
        })
    }

    return (
        <Form {...form}>
            {
                showErrors && JSON.stringify(form.formState.errors)
            }
            <form onSubmit={form.handleSubmit(handleSubmit, onError)} className="space-y-8 w-full flex justify-center">
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, { form } as React.Attributes & { form: any });
                    }
                    return null;
                })}
            </form>
        </Form>
    );
}
DataForm.displayName = "DataForm";
export default forwardRef(DataForm);
export {
    FormItemWrap
}