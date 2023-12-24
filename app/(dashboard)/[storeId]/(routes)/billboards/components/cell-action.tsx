"use client"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { BillboardColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuContent, DropdownMenuItem} from "@/components/ui/dropdown-menu"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios"
import { AlertModal } from "@/components/modals/alert-modal"

interface CellActionProps{
    data: BillboardColumn;
}
const CellAction: React.FC<CellActionProps> = ({data}) => {
    const router = useRouter()
    const params = useParams()
    const [loading, setLoading ] = useState(false)
    const [open, setOpen] = useState(false)
    const onCopy = (id: string)=>{
        navigator.clipboard.writeText(id)
        toast.success("Billboard Id copied to the clipboard.")
    }

    const onDelete = async()=>{
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/billboards/${data.id}`)
            router.refresh()
            toast.success("Billboard deleted successfully.")
        } catch (error) {
        toast.error("Make sure you have removed all categories using this billboard.")
        } finally{
            setLoading(false)
            setOpen(false)
        }
    }
  return (
    <>
    <AlertModal
    isOpen = {open}
    onClose={()=>setOpen(false)}
    onConfirm={onDelete}
    loading={loading}
    />
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
           <Button variant = "ghost" className = "h-8 w-8 p-0">
            <span className = "sr-only">Open menu</span>
            <MoreHorizontal className ="w-5 h-5" />
           </Button> 
        </DropdownMenuTrigger>
        <DropdownMenuContent align = "end">
            <DropdownMenuLabel>
                Actions
            </DropdownMenuLabel>
             <DropdownMenuItem onClick = {()=>onCopy(data.id)}>
             <Copy className = "mr-2 h-4 w-4"/>
                Copy Id
            </DropdownMenuItem>
            <DropdownMenuItem onClick = {()=>router.push(`/${params.storeId}/billboards/${data.id}`)}>
                <Edit className = "mr-2 h-4 w-4"/>
                Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick = {()=>setOpen(true)}>
                <Trash className = "mr-2 h-4 w-4"/>
                Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    </>
  )
}

export default CellAction