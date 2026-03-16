import { useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Upload as UploadIcon, Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Modal } from "@mantine/core";
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import { API_BASE_URL } from "../api";

import { userStore } from "../store/store";

function UploadPost() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState(1);
    const access_token = userStore(state => state.user.access_token);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) {
            setFile(null);
            setFileName("");
            setPreviewUrl(null);
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setOriginalImage(reader.result);
            setShowCropModal(true);
        };
        reader.readAsDataURL(selectedFile);
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCropSave = async () => {
        try {
            const croppedImageBlob = await getCroppedImg(originalImage, croppedAreaPixels);
            const croppedFile = new File([croppedImageBlob], fileName || "cropped-art.jpg", {
                type: "image/jpeg",
            });

            setFile(croppedFile);
            setFileName(croppedFile.name);
            setPreviewUrl(URL.createObjectURL(croppedImageBlob));
            setShowCropModal(false);
            toast.success("Art cropped successfully!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to crop image");
        }
    };

    async function handleUploadFlow(e) {
        if (e) e.preventDefault();

        if (!file) {
            toast.error("Please select an image file first");
            return;
        }

        if (!description || description.trim() === '') {
            toast.error("Please provide a description");
            return;
        }

        setIsUploading(true);
        const loadingToast = toast.loading("Uploading image to queue...");

        try {
            // STEP 1: Ask Node.js backend for an AWS Presigned URL
            const urlResponse = await axios.post(`${API_BASE_URL}/iq/presigned-url`, {
                fileName: file.name,
                contentType: file.type
            }, {
                headers: { 'Authorization': `Bearer ${access_token}` }
            });

            const { uploadUrl, publicUrl } = urlResponse.data;

            // STEP 2: Upload the actual image directly to AWS S3 from the browser
            await axios.put(uploadUrl, file, {
                headers: { 'Content-Type': file.type }
            });

            // STEP 3: Now tell the backend to drop this image into the ImageQueue
            await axios.post(`${API_BASE_URL}/iq`, {
                url: publicUrl, // We use the new AWS S3 public URL
                content: description,
                duration: Number(duration)
            }, {
                headers: { 'Authorization': `Bearer ${access_token}` }
            });

            toast.success('Image uploaded to queue successfully!', {
                id: loadingToast,
            });

            // Reset form
            setFile(null);
            setFileName("");
            setPreviewUrl(null);
            setDescription("");
            setDuration(1);

            // Allow file input to naturally reset its display or use a controlled ref
            document.getElementById("image-upload").value = "";

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to upload image.', {
                id: loadingToast,
            });
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-140px)] px-4 py-8">
            <Modal
                opened={showCropModal}
                onClose={() => setShowCropModal(false)}
                title="Crop your art (1:1 Ratio)"
                size="lg"
                centered
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <div className="relative w-full h-80 bg-slate-900 rounded-lg overflow-hidden">
                    <Cropper
                        image={originalImage}
                        crop={crop}
                        zoom={zoom}
                        aspect={1 / 1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>
                <div className="mt-6 flex flex-col gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-slate-500">Zoom</Label>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(e.target.value)}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black"
                        />
                    </div>
                    <Button onClick={handleCropSave} className="w-full font-bold">
                        Save Crop
                    </Button>
                </div>
            </Modal>

            <Card className="w-full max-w-md shadow-lg border-slate-200 dark:border-slate-800">
                <CardHeader className="space-y-1 text-center mb-4">
                    <CardTitle className="text-3xl font-bold tracking-tight">Upload Art</CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                        Add a new piece to the Graffiti queue
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleUploadFlow}>
                    <CardContent className="space-y-6">

                        {/* Image Preview Area */}
                        {previewUrl && (
                            <div className="flex flex-col items-center gap-3">
                                <Label className="text-sm font-medium text-slate-500 uppercase tracking-wider">Preview (1:1 Ratio)</Label>
                                <div className="w-48 h-48 rounded-xl overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                </div>
                            </div>
                        )}

                        {/* File Upload Area */}
                        <div className="space-y-3">
                            <Label htmlFor="image-upload" className="text-sm font-medium leading-none dark:text-slate-300">
                                Image File
                            </Label>
                            <div className="flex items-center gap-3">
                                <Label
                                    htmlFor="image-upload"
                                    className="flex items-center justify-center w-12 h-12 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <ImageIcon className="w-5 h-5 text-slate-500" />
                                </Label>
                                <div className="flex-1">
                                    <Input
                                        id="image-upload"
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp,image/gif"
                                        onChange={handleFileChange}
                                        className="h-12 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-800 dark:file:text-slate-300 w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description Input */}
                        <div className="space-y-3">
                            <Label htmlFor="content-desc" className="text-sm font-medium leading-none dark:text-slate-300">
                                Description
                            </Label>
                            <Input
                                id="content-desc"
                                type="text"
                                placeholder="Look at this!"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="h-10"
                            />
                        </div>

                        {/* Duration Input */}
                        <div className="space-y-3">
                            <Label htmlFor="queue-duration" className="text-sm font-medium leading-none dark:text-slate-300">
                                Queue Duration (in minutes, max 1440)
                            </Label>
                            <Input
                                id="queue-duration"
                                type="number"
                                min={1}
                                max={1440}
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="h-10"
                            />
                        </div>

                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full font-bold h-11"
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading to Queue...
                                </>
                            ) : (
                                <>
                                    <UploadIcon className="mr-2 h-4 w-4" />
                                    Upload
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default UploadPost;
