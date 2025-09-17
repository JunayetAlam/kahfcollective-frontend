"use client";
import { BiVideoPlus } from "react-icons/bi";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useDropzone, Accept, FileRejection } from "react-dropzone";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ImagePlus } from "lucide-react";

type TCustomFileUploaderProps = {
  name: string;
  label?: string;
  multiple?: boolean;
  accept?: Accept;
  className?: string;
  maxFiles?: number;
  maxSize?: number;
  minSize?: number;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  fileType?: 'image' | 'video' | 'All' | 'documents'
};

interface FileWithPreview extends File {
  id: string;
  preview?: string;
}

// Sortable Item Component
const SortableFileItem = ({
  file,
  index,
  onRemove,
  disabled,
}: {
  file: FileWithPreview;
  index: number;
  onRemove: () => void;
  disabled: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType: string): string => {
    if (fileType.startsWith("image/")) return "🖼️";
    if (fileType.startsWith("video/")) return "🎥";
    if (fileType.startsWith("audio/")) return "🎵";
    if (fileType.includes("pdf")) return "📄";
    return "📎";
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative group bg-white rounded-lg border-2 cursor-grabbing border-gray-200 overflow-hidden
        ${isDragging ? 'shadow-xl border-blue-400 z-10' : 'hover:border-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:cursor-grabbing'}
      `}
    >
      {/* Drag Handle */}
      <div

        className={`
          absolute top-2 left-2 z-20 p-1 bg-white/80 rounded cursor-grab
          opacity-0 group-hover:opacity-100 transition-opacity
        `}
        title="Drag to reorder"
      >
        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 5h2v2H9V5zm0 8h2v2H9v-2zM5 9h2v2H5V9zm0 4h2v2H5v-2zm0-8h2v2H5V5zm4 4h2v2H9V9zm8-4h2v2h-2V5zm0 4h2v2h-2V9zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm-4-4h2v2h-2v-2zm0-4h2v2h-2V9zm0 8h2v2h-2v-2zm0-12h2v2h-2V5z" />
        </svg>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className={`
          absolute top-2 right-2 z-20 p-1 bg-red-500 text-white rounded-full
          opacity-0 group-hover:opacity-100 transition-opacity
          hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed
        `}
        title="Remove file"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* File Content */}
      <div className="aspect-square relative">
        {file.preview ? (
          <Image
            src={file.preview}
            alt={`Preview ${index}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
            <div className="text-4xl mb-2">{getFileIcon(file.type)}</div>
            <p className="text-xs text-gray-600 text-center px-2 font-medium truncate w-full">
              {file.name}
            </p>
          </div>
        )}
      </div>

      {/* File Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
        <p className="text-xs font-medium truncate">{file.name}</p>
        <p className="text-xs opacity-80">{formatFileSize(file.size)}</p>
      </div>
    </div>
  );
};

const CustomFileUploader = ({
  name,
  label,
  multiple = false,
  accept = {
    "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    "application/pdf": [".pdf"],
    "video/*": [".mp4", ".avi", ".mov", ".wmv"],
    "audio/*": [".mp3", ".wav", ".ogg"],
  },
  className = "",
  maxFiles = multiple ? 10 : 1,
  maxSize = 10 * 1024 * 1024,
  minSize = 0,
  disabled = false,
  required = false,
  helperText,
  fileType = 'image'
}: TCustomFileUploaderProps) => {
  const {
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFiles = (filesToValidate: FileWithPreview[]): string[] => {
    const errors: string[] = [];

    if (required && filesToValidate.length === 0) {
      errors.push("At least one file is required");
    }

    if (filesToValidate.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""} allowed`);
    }

    filesToValidate.forEach((file, index) => {
      if (file.size > maxSize) {
        errors.push(`File ${index + 1}: Size exceeds ${formatFileSize(maxSize)}`);
      }
      if (file.size < minSize) {
        errors.push(`File ${index + 1}: Size below minimum ${formatFileSize(minSize)}`);
      }
    });

    return errors;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadErrors([]);
    clearErrors(name);

    const newFiles: FileWithPreview[] = acceptedFiles.map((file, index) => {
      const fileWithPreview = file as FileWithPreview;
      fileWithPreview.id = `${file.name}-${Date.now()}-${index}`;

      if (file.type.startsWith("image/")) {
        fileWithPreview.preview = URL.createObjectURL(file);
      }

      return fileWithPreview;
    });

    const updatedFiles = multiple
      ? [...files, ...newFiles].slice(0, maxFiles)
      : newFiles.slice(0, 1);

    const validationErrors = validateFiles(updatedFiles);

    if (validationErrors.length > 0) {
      setUploadErrors(validationErrors);
      setError(name, { type: "validation", message: validationErrors[0] });
      // Clean up preview URLs for rejected files
      newFiles.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
      return;
    }

    setFiles(updatedFiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, multiple, maxFiles, name, setError, clearErrors]);

  const onDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
    const errors: string[] = [];

    rejectedFiles.forEach((rejection) => {
      rejection.errors.forEach((error) => {
        switch (error.code) {
          case "file-too-large":
            errors.push(`"${rejection.file.name}" is too large (max: ${formatFileSize(maxSize)})`);
            break;
          case "file-too-small":
            errors.push(`"${rejection.file.name}" is too small (min: ${formatFileSize(minSize)})`);
            break;
          case "file-invalid-type":
            errors.push(`"${rejection.file.name}" has invalid type`);
            break;
          case "too-many-files":
            errors.push(`Too many files. Maximum ${maxFiles} allowed`);
            break;
          default:
            errors.push(`"${rejection.file.name}": ${error.message}`);
        }
      });
    });

    setUploadErrors(errors);
    setError(name, { type: "validation", message: errors[0] });
  }, [maxSize, minSize, maxFiles, name, setError]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    onDropRejected,
    multiple,
    accept,
    maxFiles,
    maxSize,
    minSize,
    disabled,
    noClick: files.length >= maxFiles || disabled,
    noDrag: disabled,
  });

  // Handle drag end for reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Sync files with react-hook-form
  useEffect(() => {
    if (files.length > 0) {
      setValue(name, multiple ? files : files[0], { shouldValidate: true });
    } else {
      setValue(name, multiple ? [] : null, { shouldValidate: true });
    }
  }, [files, name, setValue, multiple]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  // Remove specific file
  const removeFile = (fileId: string) => {
    const fileToRemove = files.find(f => f.id === fileId);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    setUploadErrors([]);
    clearErrors(name);
  };

  // Remove all files
  const removeAllFiles = () => {
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
    setUploadErrors([]);
    clearErrors(name);
  };

  const hasError = errors[name] || uploadErrors.length > 0;
  const errorMessage = (errors[name] as { message?: string })?.message || uploadErrors[0];
  const canAddMore = files.length < maxFiles && !disabled;

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg overflow-hidden
          transition-all duration-200 ease-in-out
          ${disabled
            ? 'bg-gray-100 border-gray-300'
            : isDragActive
              ? isDragReject
                ? 'border-red-400 bg-red-50'
                : 'border-blue-400 bg-blue-50'
              : hasError
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }
        `}
      >
        {files.length === 0 ? (
          // Empty State
          <div {...getRootProps()} className={`p-8 lg:p-12 text-center ${canAddMore ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
            <input {...getInputProps()} />
            <div className="mb-4 text-center w-full flex justify-center items-center">
              {
                fileType === 'image' && <ImagePlus className="size-12 log:size-14 text-gray-500" />
              }
              {
                fileType === 'video' && <BiVideoPlus className="size-12 log:size-14 text-gray-500" />
              }
            </div>

            <div className="space-y-2">
              <p className={`text-lg lg:text-xl font-medium ${disabled ? 'text-gray-500' : 'text-gray-700'}`}>
                {isDragActive
                  ? isDragReject
                    ? "Some files are not supported"
                    : "Drop files here"
                  : disabled
                    ? "Upload disabled"
                    : "Click to upload or drag and drop"
                }
              </p>

              <div className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
                <p>Supports: {Object.keys(accept).join(", ")}</p>
                <p>Max {maxFiles} files • Max {formatFileSize(maxSize)} each</p>
              </div>
            </div>
          </div>
        ) : (
          // Files Grid
          <div className="p-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={files.map(f => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  {files.map((file, index) => (
                    <SortableFileItem
                      key={file.id}
                      file={file}
                      index={index}
                      onRemove={() => removeFile(file.id)}
                      disabled={disabled}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Add More Button */}
            {canAddMore && (
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                <input {...getInputProps()} />
                <div className="text-gray-500">
                  <svg className="mx-auto h-8 w-8 mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-medium">Add more files</p>
                  <p className="text-xs">{files.length}/{maxFiles} uploaded</p>
                </div>
              </div>
            )}

            {/* Remove All Button */}
            {files.length > 1 && (
              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  onClick={removeAllFiles}
                  disabled={disabled}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove All Files
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Helper Text */}
      {helperText && !hasError && (
        <p className="mt-2 text-sm text-gray-600">{helperText}</p>
      )}

      {/* Error Messages */}
      {hasError && (
        <div className="mt-2 text-sm text-red-600">
          <p className="font-medium">{errorMessage}</p>
          {uploadErrors.length > 1 && (
            <ul className="mt-1 list-disc list-inside space-y-1">
              {uploadErrors.slice(1).map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Hidden Controller for react-hook-form */}
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? "This field is required" : false }}
        render={() => <p></p>}
      />
    </div>
  );
};

export default CustomFileUploader;