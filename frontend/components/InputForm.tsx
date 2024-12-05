"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import Image from "next/image";

const FormSchema = z.object({
  bug_type: z.string({
    required_error: "Please select an error type.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  text: z.string().min(10, {
    message: "Text must be at least 10 characters.",
  }).max(160, {
    message: "Text must not be longer than 160 characters.",
  }),
  image: z.any().optional(),
});

enum ErrorType {
  Type1 = "UI",
  Type2 = "Performance",
  Type3 = "Functional",
}

export default function InputForm() {
  // Properly type the files state
  const [files, setFiles] = useState<File[]>([]);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subject: "",
      text: "",
      bug_type: ErrorType.Type1,
      image: null
    },
  });

  function convertImageToBinary(file : File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const binaryString = reader.result;
        resolve(binaryString);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
  
      reader.readAsBinaryString(file);
    });
  }
  

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const binaryFiles = await Promise.all(
        files.map(file => convertImageToBinary(file))
      );
  
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== "image")
      );
  
      console.log({
        ...filteredData,
        files: binaryFiles
      });
  
      form.reset({
        subject: '',
        text: '',
        bug_type: ErrorType.Type1,
        image: null,
      });
      setFiles([]);
    } catch (error) {
      console.error('Error processing files:', error);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFiles(prev => [...prev, selectedFile]);
      form.setValue("image", selectedFile);
    }
  }

  function removeFile(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (files.length === 1) {
      form.setValue("image", null);
    }
  }

  return (
    <div className="w-full flex justify-center items-center">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader>
          <CardTitle>Upload Form</CardTitle>
          <CardDescription>Upload an image and submit your details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="bug_type"
                  render={({ field }: { field: ControllerRenderProps<any, "bug_type"> }) => (
                    <FormItem>
                      <FormLabel>Error type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ErrorType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }: { field: ControllerRenderProps<any, "subject"> }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter subject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }: { field: ControllerRenderProps<any, "text"> }) => (
                    <FormItem>
                      <FormLabel>Text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter details"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }: { field: ControllerRenderProps<any, "image"> }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleChange}
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="file_input"
                        />
                      </FormControl>
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {files.map((file, index) => (
                          <div key={`${file.name}-${index}`} className="relative group">
                            <Image 
                              src={URL.createObjectURL(file)} 
                              alt={`Upload preview ${index + 1}`}
                              width={100} 
                              height={100} 
                              className="object-cover rounded-md w-full h-24"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}