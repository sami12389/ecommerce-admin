"use client"
import {useState} from "react"
import * as z from "zod"
import {Size} from "@prisma/client"
import { useForm } from "react-hook-form"
import {Trash} from "lucide-react"
import {zodResolver} from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import axios from "axios"
import {useParams, useRouter} from "next/navigation"

import {Heading} from "@/components/ui/heading"
import {Button} from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AlertModal } from "@/components/modals/alert-modal"
import { useOrigin } from "@/hooks/use-origin"



const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: "String must be a valid hex code."
  })
})

interface ColorFormProps{
  initialData: Size | null;
}

type ColorFormValues = z.infer<typeof formSchema>

const ColorForm: React.FC<ColorFormProps> = ({
  initialData
}) => {
  const params = useParams()
  const router = useRouter()
  const origin = useOrigin()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? "Edit Color" : "Create Color"
  const description = initialData ? "Edit color details." : "Create a new color."
  const toastMessage = initialData ? "Color updated." : "Color created."
  const action = initialData ? "Save Changes" : "Create Color"
  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
        name: "",
    }
  })

  const onSubmit = async(data: ColorFormValues) => {
    try {
      setLoading(true)
      if(initialData){
      axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data)
      }else{
      axios.post(`/api/${params.storeId}/colors`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/colors`)
      toast.success(toastMessage)
    } catch (error: any) {
      toast.error("Something went wrong.")
    }finally{
      setLoading(false)
    }
  }

  const onDelete = async() => {
    try {
      setLoading(true)
      axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
      router.refresh()
      router.push("/")
      toast.success("Color deleted.")
    } catch (error) {
      toast.error("Make sure you remove all products using this color.")
    }finally{
      setLoading(false)
      setOpen(false)
    }
  }
  return (
    <>
    <AlertModal
    isOpen = {open}
    onClose = {()=>setOpen(false)}
    onConfirm = {onDelete}
    loading = {loading}
    />
    <div className = "flex items-center justify-between">
      <Heading title = {title} description = {description}/>
      {initialData && (
      <Button disabled = {loading} variant = "destructive" color = "sm" onClick = {()=>setOpen(true)}>
        <Trash className = "h-4 w-4"/>
      </Button>
      )}
    </div>
    <Separator/>
    <Form {...form}>
      <form onSubmit = {form.handleSubmit(onSubmit)} className = "space-y-8 w-full">
        
        <div className = "grid grid-cols-3 gap-8">
         <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Size name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Color value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <Button disabled = {loading} className = "ml-auto" type = "submit">
       {action}
      </Button>
      </form>
    </Form>
    </>
  )
}

export default ColorForm