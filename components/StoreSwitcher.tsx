"use client"
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Store } from "@prisma/client";
import { useRouter, useParams } from "next/navigation";
import {useStoreModal} from "@/hooks/use-store-modal"
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList, CommandItem } from "@/components/ui/command";


type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps{
    items: Store[];
}

export default function StoreSwitcher({
    className,
    items = [],
}: StoreSwitcherProps) {
    const storemodal = useStoreModal()
    const params = useParams()
    const router = useRouter()
    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id,
    }))

    const currentStore = formattedItems.find((item)=>item.value === params.storeId)

    const [open, setOpen] = useState(false)

    const onStoreSelect = (store: {value: string, label: string}) => {
        setOpen(false)
        router.push(`/stores/${store.value}`)  
    }
    return (
       <Popover open = {open} onOpenChange = {setOpen}>
        <PopoverTrigger asChild>
           <Button
           variant = "outline"
           size= "sm"
           role = "combobox"
           aria-expanded = {open}
           aria-label="Select A Store"
           className = {cn("w-[200px] justify-betweem", className)}
           >
            <StoreIcon size={24} className = "mr-2 h-4 w-4"/> 
            Current Store
            <ChevronsUpDown size={24} className = "ml-auto h-4 w-4 shrink-0 opacity-50"/> 
           </Button>
        </PopoverTrigger>
        <PopoverContent className = "w-[200px] p-0">
            <Command>
                <CommandList>
                    <CommandInput placeholder = "Search Stores" />
                    <CommandEmpty>No Store Found!</CommandEmpty>
                    <CommandGroup heading = "Stores">
                        {formattedItems.map((item) => (
                            <CommandItem>

                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
       </Popover>
    )
}