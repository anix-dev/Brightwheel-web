export const getCroppedImg = (imageSrc: string, crop: any, fileName: string): Promise<File> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        canvas.width = crop.width;
        canvas.height = crop.height;
  
        if (ctx) {
          ctx.drawImage(
            image,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            crop.width,
            crop.height
          );
  
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], fileName, { type: 'image/jpeg' }));
            } else {
              reject(new Error('Canvas is empty'));
            }
          }, 'image/jpeg');
        }
      };
      image.onerror = () => reject(new Error('Failed to load image'));
    });
  };
  