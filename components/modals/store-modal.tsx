"use client"
import { useState } from "react"
import * as z from "zod"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Modal } from "@/components/ui/modal"
import {useStoreModal} from "@/hooks/use-store-modal"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import { Button } from "@/components/ui/button"





const formSchema = z.object({
    name: z.string().min(1).max(15),
})

export const StoreModal = () => {
    const [loading, setLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })
    const storeModal = useStoreModal()

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
        setLoading(true)
        const response = await axios.post("/api/stores", values)
        window.location.assign(`/${response.data.id}`)
        console.log(response.data)
        } catch (error) {
            toast.error("Something went wrong")
        } finally{
         setLoading(false)
        }
    }
    return(<Modal
    title = "Create Store"
    description="Create a new store"
    isOpen={storeModal.isOpen}
    onClose={storeModal.onClose}
    >
       <div className = "space-y-4">
        <div className = "space-y-4 py-2 pb-4">
            <Form {...form}>
                <form onSubmit = {form.handleSubmit((onSubmit))}>
                    <FormField control = {form.control} name = "name" render = {({field})=>(
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                               <Input disabled = {loading} placeholder = "Ecommerce" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <div className = "pt-6 space-x-2 flex items-center justify-end w-full">
                        <Button variant="outline"  disabled = {loading} onClick = {storeModal.onClose}>Cancel</Button>
                        <Button type = "submit" disabled = {loading}>Continue</Button>
                    </div>
                </form>
            </Form>
        </div>
       </div>
    </Modal>)
}