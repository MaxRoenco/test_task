"use client";

import React, { useState, useCallback, useMemo, useContext } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";

// Toast Import
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { triggerContext } from '@/app/dashboard/page';

// UI Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
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

// Types and API
import { BugType } from "@/lib/types/Ticket";
import { uploadImage, checkPushUser, pushBugReport, pushMessage, pushUser, getUser } from "@/lib/api";
import Ticket from '@/lib/types/Ticket';

// Form Configuration
const FORM_CONFIG = {
  subject: {
    minLength: 5,
    maxMessage: "Subject must be at least 5 characters."
  },
  text: {
    minLength: 10,
    maxLength: 160,
    minMessage: "Text must be at least 10 characters.",
    maxMessage: "Text must not be longer than 160 characters."
  }
};

// Form Schema
const FormSchema = z.object({
  bugType: z.string({
    required_error: "Please select an error type.",
  }),
  subject: z.string().min(FORM_CONFIG.subject.minLength, {
    message: FORM_CONFIG.subject.maxMessage
  }),
  text: z.string()
    .min(FORM_CONFIG.text.minLength, { message: FORM_CONFIG.text.minMessage })
    .max(FORM_CONFIG.text.maxLength, { message: FORM_CONFIG.text.maxMessage }),
  image: z.any().optional(),
});

// Type Definitions
type FormData = z.infer<typeof FormSchema>;
type FormFieldProps<T extends keyof FormData> = {
  field: ControllerRenderProps<FormData, T>;
};

// Image Preview Component
const ImagePreviewGrid: React.FC<{
  files: File[];
  onRemove: (index: number) => void;
}> = React.memo(({ files, onRemove }) => (
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
          onClick={() => onRemove(index)}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ×
        </Button>
      </div>
    ))}
  </div>
));

// Main Form Component
export default function BugReportForm() {
  const { trigger, setTrigger } = useContext(triggerContext)!;
  const [files, setFiles] = useState<File[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subject: "",
      text: "",
      bugType: BugType.UI,
      image: null
    },
  });

  // Memoized file change handler
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFiles(prev => [...prev, selectedFile]);
      form.setValue("image", selectedFile);
    }
  }, [form]);

  // Memoized file removal handler
  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (files.length === 1) {
      form.setValue("image", null);
    }
  }, [files, form]);

  // Optimized submit handler
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Concurrent image uploads
      const uploadedImageIds = await Promise.all(
        files.map(async (file) => {
          try {
            return await uploadImage(file);
          } catch (error) {
            console.error(`Failed to upload image: ${file.name}`, error);
            return null;
          }
        })
      ).then(ids => ids.filter((id): id is number => id !== null));

      // Get or create user
      const USER_NAME = localStorage.getItem("userName");
      // const USER_ID = localStorage.getItem("userID");
      console.log(USER_NAME);
      if (USER_NAME) {
        const userId = await checkPushUser(USER_NAME);
        console.log(`User ID: ${userId}`);
        const ticketId = await pushBugReport({
          ...data,
          images: uploadedImageIds
        }, userId, files);
  
        console.log("THIS IS THE RESULT LMAOAOAO");
  
        await pushMessage(ticketId, data.text, {id: userId, name: USER_NAME});
      } else {
        console.error("User name not found in localStorage.");
      }

      // Submit bug report


      // Reset form state
      form.reset();
      setFiles([]);
      setIsOpen(false);
      setTrigger(!trigger)
      // window.location.reload();

      // Show success toast
      toast({
        title: "Bug Report Submitted",
        description: "Your bug report has been successfully recorded.",
      });
    } catch (error) {
      // Enhanced error handling
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error instanceof Error
          ? error.message
          : "An unexpected error occurred while submitting the bug report.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memoized bug type options
  const BugTypeOptions = useMemo(() =>
    Object.values(BugType).map((type) => (
      <SelectItem key={type} value={type}>
        {type}
      </SelectItem>
    )),
    []);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button>Add Ticket</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto"
        >
          <Dialog.Title className="sr-only">Add a Ticket</Dialog.Title>
          <div>
            <h1 className="text-4xl font-bold mb-3">Add a Ticket</h1>
            <p className="mb-4 text-gray-400">Upload an image and submit your details.</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {/* Bug Type Field */}
                <FormField
                  control={form.control}
                  name="bugType"
                  render={({ field }: FormFieldProps<"bugType">) => (
                    <FormItem>
                      <FormLabel>Error Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BugTypeOptions}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subject Field */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }: FormFieldProps<"subject">) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input alt='subject input field' placeholder="Enter subject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Text Field */}
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }: FormFieldProps<"text">) => (
                    <FormItem>
                      <FormLabel>Details</FormLabel>
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

                {/* Image Upload Field */}
                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                          id="file_input"
                          alt='image upload input field'
                        />
                      </FormControl>
                      <ImagePreviewGrid
                        files={files}
                        onRemove={removeFile}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
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