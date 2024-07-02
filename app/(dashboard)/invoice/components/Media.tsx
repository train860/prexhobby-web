import { FileModal, UploadFile, Uploader } from "@/components/biz/uploader"
import { Button } from "@/components/ui/button"
import { fileUrl } from "@/lib/utils"
import { PlusIcon } from "@radix-ui/react-icons"
import { forwardRef, useImperativeHandle, useMemo, useState } from "react"
type FileItem = {
    id?: string
    fileId: string
    position: number
    data?: {
        id: string
        objectKey: string
    }
}
interface MediaProps {
    value?: FileItem[]
    onPickup?: () => void
    onChange?: (files: FileItem[]) => void
}

const Media = forwardRef<HTMLInputElement, MediaProps>(
    ({ value, onChange, onPickup }, ref) => {
        const renderImageCard = (file: FileItem) => {
            let url=fileUrl(file.data?.objectKey)
            if (!url){
                return null
            }
            return (
                <div key={file.id || file.fileId} className="relative rounded-lg overflow-hidden h-full">
                    <div className="bg-[#f9f9f9] border border-[#f0f0f0] relative h-full rounded-lg overflow-hidden flex items-center">
                        <img src={url} className="w-full object-cover" />
                    </div>
                </div>
            )
        }
        const images = useMemo(()=>{
            return value?.sort((a,b)=>a.position-b.position)
        },[value])
        const renderImages = () => {
            if (!value || value.length == 0) return null
            return (
                <div className="grid grid-cols-6 gap-2">
                    {
                        images?.map((file, index) => {
                            if (index == 0) {
                                return (
                                    <div key={file.fileId} className="col-start-1 col-span-2 row-start-1 row-span-2 aspect-[1/1]">
                                        {renderImageCard(file)}
                                    </div>
                                )
                            }
                            return (
                                <div key={file.fileId} className="col-span-1 row-span-1 aspect-[1/1]">
                                   {renderImageCard(file)}
                                </div>
                            )
                        })
                    }

                    <div className="col-span-1 row-span-1 aspect-[1/1]">
                        <div onClick={() => {
                            onPickup?.()
                        }} className="aspect-content border border-gray-500 bg-[#f6f6f6] border-dashed rounded-lg h-full flex flex-col justify-center items-center cursor-pointer">
                            <PlusIcon fontSize={16}/>
                        </div>
                    </div>

                </div>
            )
        }
        return (
            <>
                {renderImages()}
                {
                    (!value || value.length == 0) && (
                        <div onClick={() => {
                            onPickup?.()
                        }} className="border border-gray-500 border-dashed rounded-lg h-full flex flex-col justify-center items-center py-10 px-4 cursor-pointer">
                            <div className="flex gap-2">
                                <Button size={'sm'} variant={'outline'}>Pickup media</Button>
                            </div>
                            <p className="mt-4 text-gray-600 text-sm">
                                Accepts images and videos
                            </p>
                        </div>
                    )
                }
            </>
        )
    })
Media.displayName = 'Media'
export default Media