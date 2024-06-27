"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import UploaderCore, { UploadFile } from ".";
import CustomDialog from "../custom-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { fileUrl } from "@/lib/utils";

interface FileModalProps {
    open?: boolean
    title?: string
    multiple?: boolean
    selected?: UploadFile[]
    params?: Record<string, any>
    onClose?: () => void
    onConfirm?: (files: UploadFile[]) => void
}
export default function FileModal({
    open = false,
    title = 'Select file',
    multiple = false,
    selected = [],
    params,
    onClose,
    onConfirm
}: FileModalProps) {
    const [files, setFiles] = useState<UploadFile[]>([])
    const [selctedKeys, setSelectedKeys] = useState<Record<string, number>>({})
    const selectedFileIds = useRef<Record<string, number>>({})
    const selectedFiles = useRef<UploadFile[]>(selected)
    const cursorRef = useRef('')
    useEffect(() => {
        if (!selected || selected.length == 0) return
        const selectedKeys = selected.reduce((acc, file) => {
            return { ...acc, [file.data?.id || '']: 1 }
        }, {})
        selectedFileIds.current = selectedKeys
        setSelectedKeys(selectedKeys)
    }, [selected])
    useEffect(() => {
        if (!open) {
            return
        }
        loadFiles()
    }, [open])
    const loadFiles = () => {
        let url = `/api/file/cursor?after=${encodeURIComponent(cursorRef.current)}`
        if (params) {
            for (const key in params) {
                url += `&${key}=${encodeURIComponent(params[key])}`
            }
        }
        fetch(url).then((res) => {
            return res.json()
        }).then((data) => {
            if (!data.files || !data.files.length) return
            const fileList = data.files.map((file: any) => {
                return {
                    data: file,
                    uuid: String(file.id),
                    url: fileUrl(file.objectKey),
                }
            })
            //concat files
            setFiles((prev) => {
                return [...prev, ...fileList]
            })
            cursorRef.current = data['files_cursor']
        })
    }
    return (
        <>
            <CustomDialog className="md:max-w-[64rem]" open={open} title={title}
                onClose={() => {
                    cursorRef.current = ''
                    onClose?.()
                    setTimeout(() => {
                        setFiles([])
                        setSelectedKeys({})
                    }, 200);
                }}
                onConfirm={() => {
                    if (!onConfirm) return
                    const mFiles: UploadFile[] = []
                    selectedFiles.current.forEach((file) => {
                        if (selctedKeys[file.data?.id || ''] == 1) {
                            mFiles.push(file)
                        }
                    })
                    onConfirm(mFiles)
                }}
            >
                <ScrollArea className="p-4 h-[65vh]" onEndReached={() => {
                    loadFiles()
                }}>
                    <UploaderCore
                        onStatusChange={(file) => {
                            setFiles((prev) => {
                                return prev.map((f) => {
                                    if (f.uuid === file.uuid) {
                                        return file
                                    }
                                    return f
                                })
                            })
                        }}
                        onChange={(files) => {
                            if (!files || files.length == 0) return
                            //loop through files
                            for (let i = 0; i < files.length; i++) {
                                const file = files[i]
                                const fileUrl = URL.createObjectURL(file.file)
                                setFiles((prev) => {
                                    return [{
                                        ...file,
                                        url: fileUrl
                                    }, ...prev]
                                })
                            }
                        }}>
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
                    </UploaderCore>

                    <div className="grid grid-cols-6 py-4">
                        {
                            files.map((file, index) => {
                                return (
                                    <div key={file.data?.id || index} className=" cursor-pointer relative rounded overflow-hidden bg-white p-5 hover:bg-[#f0f0f0]" onClick={() => {
                                        if (!file.data?.id) return
                                        setSelectedKeys((prev) => {
                                            return { ...prev, [file.data!.id]: prev[file.data!.id] ? 0 : 1 }
                                        })
                                        if(!selectedFileIds.current[file.data.id]){
                                            selectedFileIds.current[file.data.id] = 1
                                            selectedFiles.current.push(file)
                                        }
                                    }}>
                                        <div className="bg-white relative p-2 border border-[#e5e5e5] rounded-lg overflow-hidden">
                                            <div className="relative overflow-hidden h-0 pb-[100%] rounded-lg">
                                                <div className="absolute left-0 top-0 w-full h-full  flex items-center justify-center bg-[#f9f9f9] ">
                                                    <img src={file.url} className="rounded" />
                                                </div>

                                                {file.status !== 'uploading' && <div className="absolute left-0.5 top-0.5 inset-0">
                                                    <Checkbox className="bg-white" checked={selctedKeys[file.data!.id || ''] == 1} />
                                                </div>}
                                            </div>
                                            {file.status == 'uploading' && <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
                                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>}
                                        </div>
                                        <div className="text-sm mt-4 text-center px-2 break-words overflow-hidden truncate">
                                            {file.data?.name || file.file.name}
                                        </div>
                                        
                                    </div>
                                )
                            })
                        }
                    </div>
                </ScrollArea>
            </CustomDialog>
        </>
    )
}