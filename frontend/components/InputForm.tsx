"use client";

import { zodResolver } from "@hookform/resolvers/zod";
// @ts-ignore
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetcher } from "@/lib/api";
import * as Dialog from "@radix-ui/react-dialog";

const FormSchema = z.object({
  bugType: z.string({
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
  UI = "UI",
  PERFORMANCE = "Performance",
  FUNCTIONAL = "Functional",
}

interface InputFormProps {
  onSubmitSuccess?: () => void;
}

export default function InputForm({ onSubmitSuccess }: InputFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subject: "",
      text: "",
      bugType: ErrorType.UI,
      image: null
    },
  });

  // async function convertImageToBinary(file: File) {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();

  //     reader.onload = () => {
  //       const binaryString = reader.result;
  //       resolve(binaryString);
  //     };

  //     reader.onerror = () => {
  //       reject(new Error('Failed to read file'));
  //     };

  //     reader.readAsBinaryString(file);
  //   });
  // }
  async function uploadImage(file : File){
    if (!file) {
      console.error('No file provided');
      return;
    }
    const formData = new FormData();
    formData.append('files', file);
    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_API}/upload`, {
        method: 'POST',
        body: formData
      })
      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Uploaded image successfully:', data);
      return data[0]?.id || null;
    } catch(error:any){
      console.log(`Error: ${error}`);
    }
  }

  async function pushUser(name : string){
    const payload = {
      data: {
        name: name,
      },
    };
    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_API}/ticket-users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        throw new Error(`Failed to upload user: ${response.statusText}`);
      }
      const result = await response.json();
      console.log('Uploaded user successfully:', result);
      return result.data.id
    } catch (error : any){
      console.log(`Error: ${error}`);
    }
  }

  async function pushBugReport(filteredData: any, userId : any) {
    console.log(files);
    const payload = {
      data: {
        text: filteredData.text,
        bugType: filteredData.bugType,
        subject: filteredData.subject,
        priority: ["High", "Medium", "Low"][Math.floor(Math.random()*3)],
        statusBug: ["Open", "In Work", "Closed"][Math.floor(Math.random()*3)],
        images: filteredData.images,
        ticket_user: userId
      },
    };
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL_API}/bug-reports`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Strapi error response:", errorDetails);
      throw new Error(`Failed to post data: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Successfully submitted data:", result);
    console.log(result.data.id);
    return result.data.id;
  }

  // async function pushAttachment(files: File[], bugReportId: number) {
  //   for (const [index, file] of files.entries()) {
  //     const payload = {
  //       data: {
  //         filename: file.name,
  //         url: file.type,
  //         // binaryData: String(binaryFiles[index].binaryData),
  //         bug_report: String(bugReportId),
  //       },
  //     };

  //     try {
  //       const response = await fetch(
  //         `${process.env.NEXT_PUBLIC_STRAPI_URL_API}/attachments`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(payload),
  //         }
  //       );

  //       if (!response.ok) {
  //         const errorDetails = await response.json();
  //         console.error("Strapi error response:", errorDetails);
  //         throw new Error(`Failed to post data: ${response.statusText}`);
  //       }

  //       const result = await response.json();
  //       console.log("Successfully submitted data:", result);
  //     } catch (error) {
  //       console.error("Error submitting file:", file.name, error);
  //     }
  //   }
  // }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const uploadedImageIds: number[] = [];
      for (const file of files) {
        const imageId = await uploadImage(file);
        if (imageId !== null) {
          uploadedImageIds.push(imageId);
        }
      }
      console.log('Uploaded Image IDs:', uploadedImageIds);
      const bugReportData = {
        ...data,
        images: uploadedImageIds, // Assuming your bug_report model has an "images" field
      };
      const userId = await pushUser("Max");
      console.log("HIIII");
      console.log(userId);
      console.log("HIIII");
      let bugReportId = await pushBugReport(bugReportData, userId);
      console.log(bugReportId)
      // await pushAttachment(files, bugReportId);

      form.reset({
        subject: '',
        text: '',
        bugType: ErrorType.UI,
        image: null,
      });
      setFiles([]);
      setIsOpen(false); // Close the dialog after successful submission

      // Call the success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
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
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button>Add Ticket</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)} // Close dialog when clicking outside
        />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto"
        >
          <Dialog.Title></Dialog.Title>
          <div>
            <h1 className="text-4xl font-bold mb-3">Add a ticket</h1>
            <p className="mb-4 text-gray-400">Upload an image and submit your details.</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="bugType"
                  render={({ field }: { field: ControllerRenderProps<any, "bugType"> }) => (
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
                            <Button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </Button>
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
          <Dialog.Close asChild>
            <Button
              type="button"
              variant="ghost"
              className="absolute top-4 right-4"
            >
              ×
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}