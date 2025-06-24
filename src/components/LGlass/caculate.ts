
export interface IPostion {x: number, y: number, width: number, height: number}
export const cutImageData = (imageData:ImageData, option:IPostion)=>{
  const rect = {
    x: option.x,
    y: option.y,
    width: option.width,
    height: option.height
  }
  const sourceRect = {
    width: imageData.width,
    height: imageData.height
  }
  const {imgData} = cloneImageData(imageData) || {}
  const dstImageData = getEmptyData(imageData)?.imgData
  if(!dstImageData) {
    return;
  }
  const dstData = dstImageData?.data || []
  if(!imgData) {
    return imgData
  }
  const maxOffset = 6;  // 最大折射像素偏移
  const edgeZone = 30;  // 离边缘多远开始折射
  const power = 2.2;    // 折射强度曲线
  for(let y =0;y<imgData?.height;y++) {
    for(let x = 0;x<imgData.width;x++) {
      const idx = (y * sourceRect.width + x) * 4;
      if(isInHit(x,y,option)) {
         // 归一化坐标（0 ~ 1）        
        const distLeft = x - rect.x;
        const distRight = rect.x + rect.width - x;
        const distTop = y - rect.y;
        const distBottom = rect.y + rect.height - y;
        const edgeDist = Math.min(distLeft, distRight, distTop, distBottom);
        // 折射区域限定在 edgeZone 内
        const ratio = Math.max(0, 1 - edgeDist / edgeZone);
        const refractStrength = Math.pow(ratio, power) * maxOffset;

        // 模拟折射方向（朝最近边缘方向偏移）
        let offsetX = x;
        let offsetY = y;
        // X方向
        if (distLeft < distRight) {
          offsetX = x - refractStrength;
        } else {
          offsetX = x + refractStrength;
        }

        // Y方向
        if (distTop < distBottom) {
          offsetY = y - refractStrength;
        } else {
          offsetY = y + refractStrength;
        }

        // 取样像素（边界保护）
        const sampleX = Math.min(sourceRect.width - 1, Math.max(0, Math.round(offsetX)));
        const sampleY = Math.min(sourceRect.height - 1, Math.max(0, Math.round(offsetY)));
        const srcIdx = (sampleY * sourceRect.width + sampleX) * 4;

        // 彩虹色效果 - 对RGB通道应用不同的折射偏移
        const rOffset = Math.round(refractStrength * 1.2);  // 红色偏移最大
        const gOffset = Math.round(refractStrength * 0.8);  // 绿色偏移中等
        const bOffset = Math.round(refractStrength * 0.4);  // 蓝色偏移最小
        
        // 计算各通道的采样位置
        const rX = Math.min(sourceRect.width - 1, Math.max(0, Math.round(offsetX + rOffset)));
        const rY = Math.min(sourceRect.height - 1, Math.max(0, Math.round(offsetY + rOffset)));
        const rIdx = (rY * sourceRect.width + rX) * 4;
        
        const gX = Math.min(sourceRect.width - 1, Math.max(0, Math.round(offsetX + gOffset)));
        const gY = Math.min(sourceRect.height - 1, Math.max(0, Math.round(offsetY + gOffset)));
        const gIdx = (gY * sourceRect.width + gX) * 4;
        
        const bX = Math.min(sourceRect.width - 1, Math.max(0, Math.round(offsetX + bOffset)));
        const bY = Math.min(sourceRect.height - 1, Math.max(0, Math.round(offsetY + bOffset)));
        const bIdx = (bY * sourceRect.width + bX) * 4;
        
        // 分别采样RGB通道
        dstData[idx]     = imageData.data[rIdx] + 10;    // R
        dstData[idx + 1] = imageData.data[gIdx + 1] + 10; // G
        dstData[idx + 2] = imageData.data[bIdx + 2] + 10; // B
        dstData[idx + 3] = imageData.data[srcIdx + 3] + 10; // Alpha不变
      } else {
        dstData[idx]     = imageData.data[idx];
        dstData[idx + 1] = imageData.data[idx + 1];
        dstData[idx + 2] = imageData.data[idx + 2];
        dstData[idx + 3] = imageData.data[idx + 3];
      }
    }
    
  }
  return cloneImageData(dstImageData,option)
}

export const isInHit = (x:number,y:number,option:IPostion)=>{
  if(x>option.x && x<option.x+option.width && y>option.y && y< option.y+option.height){
    return true;
  } else {
    return false
  }
}

export const cloneImageData = (imageData:ImageData | undefined, pos: IPostion|null = null)=>{
  if(!imageData) {
    return
  }
  const {
    width,height
  } = imageData;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context?.putImageData(imageData,0,0)
  const imgData = context?.getImageData(pos?pos.x:0,pos?pos.y:0,pos?pos.width:width,pos?pos.height:height)
  return {
    imgData,
  }
}
export const getEmptyData = (imageData:ImageData | undefined)=>{
  if(!imageData) {
    return
  }
  const {
    width,height
  } = imageData;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context?.putImageData(imageData,0,0)
  const imgData = context?.createImageData(width,height)
  return {
    imgData,
  }
}
