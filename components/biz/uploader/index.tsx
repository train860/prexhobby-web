"use client"
import { Button } from "@/components/ui/button"
import { useRef } from "react"
import FileModal from "./FileModal"
import Uploader, { UploadCard } from "./Uploader"
import {v4 as uuidv4} from "uuid"
import { object } from "zod"
export type UploadFile = {
    file: File
    uuid: string
    id?: string
    url?: string
    data?: {
        id: string
        name: string
        objectKey: string
    }
    status: 'uploading' | 'done' | 'error'
}

interface UploaderCoreProps {
    className?: string
    children?: React.ReactNode
    onChange?: (files: UploadFile[] | null) => void
    onStatusChange?: (file: UploadFile) => void
}

export default function UploaderCore({
    className,
    children,
    onChange,
    onStatusChange,
}: UploaderCoreProps) {
    const ref = useRef<HTMLInputElement>(null)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length == 0) return
        const uploadFiles: UploadFile[] = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            uploadFiles.push({
                file,
                uuid:uuidv4(),
                status: 'uploading'
            })
            handleUpload2Server(uploadFiles[i])
        }
        onChange?.(uploadFiles)
    }
    const handleUpload2Server = (file: UploadFile) => {
        const formData = new FormData()
        formData.append('file', file.file)
        fetch('/api/file', {
            method: 'POST',
            body: formData,
        }).then(res => res.json())
        .then(data => {
            const {fileUpload}=data.data
            file.status = 'done'
            file.url = fileUpload.url
            file.data = {
                id: fileUpload.id,
                name: fileUpload.name,
                objectKey: fileUpload.objectKey
            }
            onStatusChange?.(file)
        })
        .catch(() => {
            file.status = 'error'
            onStatusChange?.(file)
        })
    }
    const renderContent = () => {
        if (children) {
            return children
        }
        return (
            <div className="border border-gray-500 border-dashed rounded-lg flex flex-col justify-center items-center py-10 cursor-pointer">
                <div className="flex gap-2">
                    <Button size={'sm'} variant={'outline'}>Upload media</Button>
                    <Button size={'sm'} variant={'link'} onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}>Add from URL</Button>
                </div>
                <p className="mt-4 text-gray-600 text-sm">
                    Drag and drop your files here
                </p>
            </div>
        )
    }
    return (
        <div className={className} onClick={() => ref.current?.click()}>
            {children}
            <input className="hidden" type="file" ref={ref} onChange={handleChange} />
        </div>
    )
}

export {
    FileModal,
    Uploader,
    UploadCard,
}