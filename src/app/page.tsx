'use client'

import ReactCrop, { Crop } from 'react-image-crop'
import { useState, useRef } from 'react'
import 'react-image-crop/dist/ReactCrop.css'

export default function CropDemo() {
  const [crop, setCrop] = useState<Crop>({ aspect: 16 / 9 }) // Initial aspect ratio
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop({ unit: '%', width: 50, aspect: 16 / 9 })
  }

  const getCroppedImg = () => {
    if (!completedCrop || !canvasRef.current || !imgRef.current) {
      return
    }

    const image = imgRef.current
    const canvas = canvasRef.current
    const crop = completedCrop

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const ctx = canvas.getContext('2d')

    canvas.width = crop.width
    canvas.height = crop.height

    ctx?.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )
  }

  return (
    <div>
      <ReactCrop
        crop={crop}
        onChange={(newCrop) => setCrop(newCrop)}
        onComplete={(c) => setCompletedCrop(c)}
      >
        <img
          ref={imgRef}
          src="https://www.bing.com/th?id=OADD2.9964502956758_1WGVCF0HH844IIJ6O3&pid=21.2&c=3&w=300&h=157&dynsize=1&qlt=90"
          onLoad={onImageLoad}
          alt="Demo Image"
        />
      </ReactCrop>
      <button onClick={getCroppedImg}>Crop Image</button>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', marginTop: '10px' }}
      />
    </div>
  )
}
