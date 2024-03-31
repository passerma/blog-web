function getBase64Image(img: HTMLImageElement) {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  ctx!.drawImage(img, 0, 0, img.width, img.height)
  const dataURL = canvas.toDataURL('image/png')
  return dataURL
}

export function createBase64(imageUrl: string, callback: (bash64: string) => void) {
  const image = new Image()
  image.crossOrigin = ''
  image.src = imageUrl
  image.onload = function () {
    const base64 = getBase64Image(image)
    callback(base64)
  }
}

export function url2File(imageUrl: string) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('get', imageUrl, true)
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (this.status === 200) {
        const file = new File([this.response], `${Date.now()}.png`)
        resolve(file)
      } else {
        resolve(null)
      }
    }
    xhr.send()
    xhr.onerror = () => {
      resolve(null)
    }
  })
}


export function base64ToFile(data: string, fileName: string) {
  const dataArr = data.split(",");
  const byteString = atob(dataArr[1]);
  const options = {
    type: "image/jpeg",
    endings: "native" as const
  };
  const u8Arr = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    u8Arr[i] = byteString.charCodeAt(i);
  }
  let formData = new FormData();
  let fileOfBlob = new File([u8Arr], fileName + ".jpg", options);//返回文件流
  formData.append("img", fileOfBlob);
  return formData
}
