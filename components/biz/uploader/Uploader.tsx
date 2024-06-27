import React, { useEffect, useState } from "react"
import UploaderCore, { UploadFile } from "."
import { Button } from "@/components/ui/button"

interface UploaderProps {
    showFiles?: boolean
    multiple?: boolean
    children?: React.ReactNode
    onBeforeUpload?: (file: UploadFile) => void
    onChange?: (files: UploadFile[] | null) => void
}

const UploadCard = (props: UploaderProps) => {
    const { showFiles = true, multiple = false,onChange } = props
    const [files, setFiles] = useState<UploadFile[]>([])
    const renderImageCard = (file: UploadFile, index: number) => {
        return (
            <div key={file.data?.id || index} className="relative rounded-lg overflow-hidden h-full">
                <div className="bg-white relative h-full p-2 border border-[#e5e5e5] rounded-lg overflow-hidden">
                    <img src={file.url} className="w-full h-32 object-cover" />
                </div>
                {file.status == 'uploading' &&
                    <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>}
            </div>
        )
    }
    const renderImage = () => {
        if (!multiple && showFiles && files.length > 0) {
            return <div className="absolute left-0 top-0 w-full h-full">
                {
                    files.map((file, index) => {
                        return renderImageCard(file, index)
                    })
                }
            </div>
        }
        return null
    }
    return (
        <>
            {(multiple && showFiles && files.length > 0) &&
                (

                    files.map((file, index) => {
                        return renderImageCard(file, index)
                    })

                )
            }
            <Uploader {...props} showFiles={false} onChange={(files) => {
                setFiles(files || [])
                onChange?.(files)
            }}>
                <div className="border border-gray-500 border-dashed rounded-lg h-full flex flex-col justify-center items-center py-10 px-4 cursor-pointer">
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
                {renderImage()}
            </Uploader>
        </>
    )
}

export default function Uploader({
    showFiles = true,
    multiple = false,
    children,
    onBeforeUpload,
    onChange,
}: UploaderProps) {
    const [files, setFiles] = useState<UploadFile[]>([])
    useEffect(() => {
        onChange?.(files)
    },[files])
    const renderImageCard = (file: UploadFile, index: number) => {
        return (
            <div key={file.data?.id || index} className="relative rounded-lg overflow-hidden h-full">
                <div className="bg-white relative h-full p-2 border border-[#e5e5e5] rounded-lg overflow-hidden">
                    <img src={file.url} className="w-full h-32 object-cover" />
                </div>
                {file.status == 'uploading' &&
                    <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>}
            </div>
        )
    }
    return (
        <div className="flex flex-row items-center gap-3 flex-wrap">

            <UploaderCore
                className="relative w-full"
                onStatusChange={(file) => {
                    setFiles((prevFiles) => {
                        const fileList = prevFiles.map((f) => {
                            if (f.uuid === file.uuid) {
                                return file
                            }
                            return f
                        })
                        return fileList
                    })
                }}
                onChange={(mFiles) => {
                    
                    if (!mFiles || mFiles.length == 0) return
                    if (!multiple) {
                        const file = mFiles[0]
                        const fileUrl = URL.createObjectURL(file.file)
                        const fileList = [{ url: fileUrl, ...file }]
                        return setFiles([...fileList])
                    }
                    //loop through mFiles
                    for (let i = 0; i < mFiles.length; i++) {
                        const file = mFiles[i]
                        if (!file.url && file.file) {
                            file.url = URL.createObjectURL(file.file)
                        }
                    }
                    setFiles([...mFiles])
                }}>
                {children}
            </UploaderCore>
            {(showFiles && files.length > 0) &&
                (

                    files.map((file, index) => {
                        return renderImageCard(file, index)
                    })

                )
            }
        </div>

    )
}

export { UploadCard }