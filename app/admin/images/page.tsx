"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Upload, RefreshCw, Save, ImageIcon, Search } from "lucide-react"
import Image from "next/image"
import { getImageTags } from "@/utils/image-utils"
import { useToast } from "@/hooks/use-toast"
// Import the Pagination component
import { Pagination } from "@/components/ui/pagination"

type ImageItem = {
  url: string
  pathname: string
  uploadedAt: string
  size: number
  category: string
}

type ImageMapping = Record<
  string,
  {
    url: string
    alt: string
    section: string
    description: string
  }
>

// Constants for pagination
const ITEMS_PER_PAGE = 9

export default function ImagesAdmin() {
  const { toast } = useToast()

  // Image upload state
  const [images, setImages] = useState<ImageItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [category, setCategory] = useState("gallery")

  // Tag management state
  const [imageMapping, setImageMapping] = useState<ImageMapping>({})
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [editedImage, setEditedImage] = useState({
    url: "",
    alt: "",
    section: "",
    description: "",
  })

  // Shared state
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [tagPage, setTagPage] = useState(1)

  // State for using existing image
  const [imageToUseForTag, setImageToUseForTag] = useState<string | null>(null)
  const [shouldUseExistingImage, setShouldUseExistingImage] = useState(false)

  // Load data on component mount
  useEffect(() => {
    loadImages()
    loadImageMapping()
  }, [])

  // Reset pagination when search term changes
  useEffect(() => {
    setCurrentPage(1)
    setTagPage(1)
  }, [searchTerm])

  // Load all images from Vercel Blob
  const loadImages = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/images")
      if (!response.ok) {
        throw new Error(`Failed to load images: ${response.statusText}`)
      }

      const data = await response.json()
      setImages(data.images || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while loading images"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load image tag mappings
  const loadImageMapping = async () => {
    try {
      const response = await fetch("/api/images/map")
      if (!response.ok) {
        throw new Error(`Failed to load image mapping: ${response.statusText}`)
      }

      const data = await response.json()
      setImageMapping(data || {})
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while loading image mapping"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  // Handle file selection for upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  // Handle image upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    setIsUploading(true)
    setError("")
    setSuccess("")

    try {
      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("category", category)

      // If a tag is selected, include it and its metadata
      if (selectedTag) {
        formData.append("tag", selectedTag)
        formData.append("alt", editedImage.alt)
        formData.append("section", editedImage.section || category)
        formData.append("description", editedImage.description)
      }

      // Upload the file and map it to the tag if provided
      const response = await fetch("/api/admin/images/upload-and-map", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to upload image")
      }

      const data = await response.json()

      const successMessage = selectedTag
        ? `Image uploaded and mapped to tag "${selectedTag}" successfully!`
        : `Image uploaded successfully: ${data.url}`

      setSuccess(successMessage)
      toast({
        title: "Success",
        description: successMessage,
      })

      setSelectedFile(null)

      // If a tag is selected, update the edited image with the new URL
      if (selectedTag) {
        setEditedImage({
          ...editedImage,
          url: data.url,
        })

        // Update the local image mapping
        setImageMapping((prev) => ({
          ...prev,
          [selectedTag]: {
            url: data.url,
            alt: editedImage.alt || selectedTag.replace(/-/g, " "),
            section: editedImage.section || category,
            description: editedImage.description || `Image for ${selectedTag}`,
          },
        }))
      }

      // Reload the images list
      loadImages()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during upload"
      setError(errorMessage)
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Handle image deletion
  const handleDelete = async (pathname: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const response = await fetch(`/api/admin/images/delete?pathname=${encodeURIComponent(pathname)}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete image")
      }

      setSuccess("Image deleted successfully")
      toast({
        title: "Success",
        description: "Image deleted successfully",
      })

      // Remove the deleted image from the state
      setImages(images.filter((img) => img.pathname !== pathname))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while deleting the image"
      setError(errorMessage)
      toast({
        title: "Deletion Failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag)
    const imageData = imageMapping[tag] || { url: "", alt: "", section: "", description: "" }
    setEditedImage(imageData)

    // Set the category based on the tag prefix
    if (tag.startsWith("gallery-")) {
      setCategory("gallery")
    } else if (tag.startsWith("activity-")) {
      setCategory("activities")
    } else if (tag.startsWith("booking-")) {
      setCategory("booking")
    } else if (tag === "hero-background") {
      setCategory("hero")
    }
  }

  // Handle input changes for tag metadata
  const handleInputChange = (field: string, value: string) => {
    setEditedImage((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle saving tag mapping
  const handleSaveTag = async () => {
    if (!selectedTag) return

    try {
      const response = await fetch("/api/images/map/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tag: selectedTag,
          imageData: editedImage,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update image mapping")
      }

      const successMessage = `Image mapping for "${selectedTag}" updated successfully`
      setSuccess(successMessage)
      toast({
        title: "Success",
        description: successMessage,
      })

      // Update local state
      setImageMapping((prev) => ({
        ...prev,
        [selectedTag]: editedImage,
      }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while updating image mapping"
      setError(errorMessage)
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  // Handle deleting tag mapping
  const handleDeleteTag = async (tag: string) => {
    if (!confirm(`Are you sure you want to delete the mapping for "${tag}"?`)) return

    try {
      const response = await fetch(`/api/images/map/update?tag=${encodeURIComponent(tag)}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete image mapping")
      }

      const successMessage = `Image mapping for "${tag}" deleted successfully`
      setSuccess(successMessage)
      toast({
        title: "Success",
        description: successMessage,
      })

      // Update local state
      const newMapping = { ...imageMapping }
      delete newMapping[tag]
      setImageMapping(newMapping)
      if (selectedTag === tag) {
        setSelectedTag(null)
        setEditedImage({ url: "", alt: "", section: "", description: "" })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while deleting image mapping"
      setError(errorMessage)
      toast({
        title: "Deletion Failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  // Get all available tags
  const availableTags = getImageTags()

  // Filter tags based on search term
  const filteredTags = useMemo(() => {
    return availableTags.filter((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [availableTags, searchTerm])

  // Paginate tags
  const paginatedTags = useMemo(() => {
    const startIndex = (tagPage - 1) * ITEMS_PER_PAGE
    return filteredTags.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredTags, tagPage])

  // Calculate total pages for tags
  const totalTagPages = Math.ceil(filteredTags.length / ITEMS_PER_PAGE)

  // Filter and paginate images
  const filteredImages = useMemo(() => {
    return images.filter(
      (img) =>
        img.pathname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [images, searchTerm])

  // Paginate images
  const paginatedImages = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredImages.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredImages, currentPage])

  // Calculate total pages for images
  const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE)

  // Function to use existing image for tag
  const useExistingImage = useCallback(() => {
    if (selectedTag && imageToUseForTag) {
      setEditedImage((prev) => ({
        ...prev,
        url: imageToUseForTag,
      }))
      setSuccess(`Image selected for tag "${selectedTag}". Click "Save Changes" to apply.`)
      toast({
        title: "Image Selected",
        description: `Image selected for tag "${selectedTag}". Click "Save Changes" to apply.`,
      })
    } else {
      setError("Please select a tag first before choosing an image")
      toast({
        title: "Error",
        description: "Please select a tag first before choosing an image",
        variant: "destructive",
      })
    }
  }, [selectedTag, imageToUseForTag, toast])

  // Conditionally call useExistingImage based on imageToUseForTag and selectedTag
  useEffect(() => {
    if (imageToUseForTag && selectedTag) {
      setShouldUseExistingImage(true)
    } else {
      setShouldUseExistingImage(false)
    }
  }, [imageToUseForTag, selectedTag])

  useEffect(() => {
    if (shouldUseExistingImage) {
      useExistingImage()
      setShouldUseExistingImage(false) // Reset the trigger
      setImageToUseForTag(null)
    }
  }, [shouldUseExistingImage, useExistingImage])

  // Pagination controls

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Image Management</h1>
        <div className="flex gap-2">
          <Button
            onClick={loadImages}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Images
          </Button>
          <Button
            onClick={loadImageMapping}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Tags
          </Button>
        </div>
      </div>

      {error && <div className="bg-red-900/20 text-red-400 p-3 rounded-md border border-red-900/30">{error}</div>}
      {success && (
        <div className="bg-green-900/20 text-green-400 p-3 rounded-md border border-green-900/30">{success}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tags Panel */}
        <Card className="md:col-span-1 bg-zinc-900 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle>Image Tags</CardTitle>
            <CardDescription className="text-zinc-400">Select a tag to edit its image mapping</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-white" />
              </div>
            ) : (
              <>
                <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2">
                  {paginatedTags.length > 0 ? (
                    paginatedTags.map((tag) => (
                      <div
                        key={tag}
                        className={`p-2 rounded-md cursor-pointer hover:bg-zinc-800 transition-colors ${
                          selectedTag === tag ? "bg-zinc-800 border-l-2 border-white" : ""
                        }`}
                        onClick={() => handleTagSelect(tag)}
                      >
                        <p className="font-medium text-sm">{tag}</p>
                        <p className="text-xs text-zinc-500 truncate">{imageMapping[tag]?.url || "No image mapped"}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-zinc-500">No tags found matching your search</p>
                  )}
                </div>

                {filteredTags.length > ITEMS_PER_PAGE && (
                  <Pagination currentPage={tagPage} totalPages={totalTagPages} onPageChange={setTagPage} />
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Tag Editor Panel */}
        <Card className="md:col-span-2 bg-zinc-900 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle>{selectedTag ? `Editing: ${selectedTag}` : "Select a tag to edit"}</CardTitle>
            <CardDescription className="text-zinc-400">
              Upload a new image or select an existing one for this tag
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedTag ? (
              <p className="text-center py-8 text-zinc-500">Select a tag from the list to edit its mapping</p>
            ) : (
              <div className="space-y-6">
                {/* Current Image Preview */}
                {editedImage.url && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2 text-zinc-400">Current Image:</p>
                    <div className="relative h-48 w-full border border-zinc-700 rounded-md overflow-hidden">
                      <Image
                        src={editedImage.url || "/placeholder.svg"}
                        alt={editedImage.alt || "Preview"}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Upload New Image Section */}
                <div className="border border-zinc-800 rounded-md p-4 bg-zinc-800/50">
                  <h3 className="text-lg font-medium mb-4">Upload New Image for {selectedTag}</h3>
                  <form onSubmit={handleUpload} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="file" className="text-zinc-400">
                        Select Image File
                      </Label>
                      <Input
                        id="file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                        className="bg-zinc-900 border-zinc-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image-alt" className="text-zinc-400">
                        Alt Text
                      </Label>
                      <Input
                        id="image-alt"
                        value={editedImage.alt}
                        onChange={(e) => handleInputChange("alt", e.target.value)}
                        placeholder="Description of the image"
                        className="bg-zinc-900 border-zinc-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image-section" className="text-zinc-400">
                        Section
                      </Label>
                      <Input
                        id="image-section"
                        value={editedImage.section}
                        onChange={(e) => handleInputChange("section", e.target.value)}
                        placeholder="hero, gallery, activities, etc."
                        className="bg-zinc-900 border-zinc-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image-description" className="text-zinc-400">
                        Description
                      </Label>
                      <Input
                        id="image-description"
                        value={editedImage.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Detailed description of the image"
                        className="bg-zinc-900 border-zinc-700 text-white"
                      />
                    </div>

                    {selectedFile && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-zinc-400">Preview:</p>
                        <div className="mt-2 relative h-40 w-full border border-zinc-700 rounded-md overflow-hidden">
                          <Image
                            src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                            alt="Preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={!selectedFile || isUploading}
                      className="flex items-center gap-2 bg-white text-black hover:bg-zinc-200"
                    >
                      {isUploading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Upload & Map to {selectedTag}
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                {/* Image Metadata Section */}
                <div className="border border-zinc-800 rounded-md p-4 bg-zinc-800/50">
                  <h3 className="text-lg font-medium mb-4">Image Metadata</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image-url" className="text-zinc-400">
                        Image URL
                      </Label>
                      <Input
                        id="image-url"
                        value={editedImage.url}
                        onChange={(e) => handleInputChange("url", e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="bg-zinc-900 border-zinc-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image-alt-2" className="text-zinc-400">
                        Alt Text
                      </Label>
                      <Input
                        id="image-alt-2"
                        value={editedImage.alt}
                        onChange={(e) => handleInputChange("alt", e.target.value)}
                        placeholder="Description of the image"
                        className="bg-zinc-900 border-zinc-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image-section-2" className="text-zinc-400">
                        Section
                      </Label>
                      <Input
                        id="image-section-2"
                        value={editedImage.section}
                        onChange={(e) => handleInputChange("section", e.target.value)}
                        placeholder="hero, gallery, activities, etc."
                        className="bg-zinc-900 border-zinc-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image-description-2" className="text-zinc-400">
                        Description
                      </Label>
                      <Input
                        id="image-description-2"
                        value={editedImage.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Detailed description of the image"
                        className="bg-zinc-900 border-zinc-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4">
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteTag(selectedTag)}
                    className="flex items-center gap-1 bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900/30"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove Mapping
                  </Button>
                  <Button
                    onClick={handleSaveTag}
                    className="flex items-center gap-1 bg-white text-black hover:bg-zinc-200"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Existing Images Gallery */}
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle>Existing Images</CardTitle>
          <CardDescription className="text-zinc-400">
            Select an existing image to use for the selected tag
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : paginatedImages.length === 0 ? (
            <p className="text-center py-8 text-zinc-500">
              {searchTerm
                ? "No images found matching your search."
                : "No images found. Upload some images to get started."}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedImages.map((image) => (
                  <div
                    key={image.pathname}
                    className="border border-zinc-800 rounded-md overflow-hidden bg-zinc-800/50"
                  >
                    <div className="relative h-40 w-full">
                      <Image src={image.url || "/placeholder.svg"} alt={image.pathname} fill className="object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium truncate" title={image.pathname}>
                        {image.pathname.split("/").pop()}
                      </p>
                      <p className="text-xs text-zinc-500">Category: {image.category || "Uncategorized"}</p>
                      <div className="mt-2 flex justify-between">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(image.pathname)}
                          className="flex items-center gap-1 bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900/30"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setImageToUseForTag(image.url)}
                          disabled={!selectedTag}
                          className="flex items-center gap-1 border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
                        >
                          <ImageIcon className="h-4 w-4" />
                          Use for Tag
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredImages.length > ITEMS_PER_PAGE && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
