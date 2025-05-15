"use client";


import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./Gallery.module.css";

const GalleryPage = () => {
  const [images, setImages] = useState<Array<{ id: number; src: string; name: string }>>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  let nextId = useRef(1);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    let loaded = 0;
    const newImages: Array<{ id: number; src: string; name: string }> = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newImages.push({
          id: nextId.current++,
          src: event.target?.result as string,
          name: file.name,
        });
        loaded++;
        if (loaded === files.length) {
          setImages((prev) => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
    // Do not reset file input here; wait until all files are loaded
    // if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Reset file input after images are added
  useEffect(() => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [images]);

  const handleDelete = (id: number) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    // For demo: just highlight the image, real edit would open a modal/form
  };

  const handleView = (src: string) => {
    window.open(src, "_blank");
  };

  const handleDownload = (src: string, name: string) => {
    const link = document.createElement("a");
    link.href = src;
    link.download = name;
    link.click();
  };

  const handleShare = async (src: string) => {
    if (navigator.share) {
      await navigator.share({ url: src });
    } else {
      alert("Share not supported in this browser.");
    }
  };

  return (
    <div className={styles.galleryContainer}>
      <h1>Gallery</h1>
      <div className={styles.uploadBar}>
        <button type="button" onClick={() => fileInputRef.current?.click()}>
          Upload Images
        </button>
        <input
          id="file-upload"
          className={styles.fileInput}
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleUpload}
          title="Upload images"
        />
      </div>
      <div className={styles.grid}>
        {images.map((img) => (
          <div
            key={img.id}
            className={
              editingId === img.id
                ? `${styles.card} ${styles.cardEditing}`
                : styles.card
            }
          >
            <Image src={img.src} alt={img.name} width={180} height={120} style={{ objectFit: "cover", borderRadius: 4 }} />
            <div className={styles.buttonBar}>
              <button onClick={() => handleView(img.src)}>View</button>
              <button onClick={() => handleDownload(img.src, img.name)}>Download</button>
              <button onClick={() => handleShare(img.src)}>Share</button>
              <button onClick={() => handleEdit(img.id)}>{editingId === img.id ? "Editing" : "Edit"}</button>
              <button onClick={() => handleDelete(img.id)} className={styles.deleteButton}>Delete</button>
            </div>
            <div className={styles.imageName}>{img.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
