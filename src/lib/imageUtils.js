import imageCompression from 'browser-image-compression'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'

export async function compressAndUpload(file) {
  const options = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 600,
    useWebWorker: true,
    initialQuality: 0.6,
  }

  const compressed = await imageCompression(file, options)

  const fileName = `foods/${Date.now()}_${file.name}`
  const storageRef = ref(storage, fileName)
  await uploadBytes(storageRef, compressed)
  const url = await getDownloadURL(storageRef)
  return url
}

export async function deleteImage(url) {
  if (!url) return
  try {
    const storageRef = ref(storage, url)
    await deleteObject(storageRef)
  } catch (e) {
    // 이미 삭제됐거나 없는 파일이면 무시
  }
}
