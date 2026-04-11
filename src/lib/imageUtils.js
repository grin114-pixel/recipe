import imageCompression from 'browser-image-compression'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'

function safeBaseName(name) {
  const base = String(name || 'image').replace(/[/\\]/g, '_')
  const cleaned = base.replace(/[^\w.\-가-힣]/g, '_')
  return cleaned.slice(0, 120) || 'image.jpg'
}

/** Firebase Storage HTTPS 다운로드 URL → 스토리지 객체 경로 */
function pathFromDownloadUrl(url) {
  try {
    const u = new URL(url)
    if (!u.hostname.includes('firebasestorage.googleapis.com')) return null
    const i = u.pathname.indexOf('/o/')
    if (i === -1) return null
    const encoded = u.pathname.slice(i + 3)
    return decodeURIComponent(encoded)
  } catch {
    return null
  }
}

async function compressFile(file) {
  const options = {
    maxSizeMB: 0.35,
    maxWidthOrHeight: 600,
    useWebWorker: false,
    initialQuality: 0.72,
  }
  try {
    return await imageCompression(file, options)
  } catch (e) {
    try {
      return await imageCompression(file, { ...options, maxSizeMB: 1 })
    } catch (e2) {
      if (file.size <= 5 * 1024 * 1024) return file
      throw new Error('이미지 압축에 실패했습니다. 용량이 작은 사진으로 다시 시도해 주세요.')
    }
  }
}

export async function compressAndUpload(file) {
  if (!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) {
    throw new Error('Firebase Storage 환경 변수(VITE_FIREBASE_*)가 설정되지 않았습니다.')
  }

  const blob = await compressFile(file)
  const name = `${Date.now()}_${safeBaseName(file.name)}`
  const fileName = `foods/${name}`
  const storageRef = ref(storage, fileName)
  const mime = blob.type || file.type || 'image/jpeg'
  await uploadBytes(storageRef, blob, { contentType: mime })
  return getDownloadURL(storageRef)
}

export async function deleteImage(url) {
  if (!url) return
  const path = pathFromDownloadUrl(url)
  if (!path) return
  try {
    await deleteObject(ref(storage, path))
  } catch (e) {
    // 이미 삭제됐거나 없는 파일이면 무시
  }
}
