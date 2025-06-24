import html2canvas from "html2canvas"
import { CSSProperties, PropsWithChildren, useEffect, useMemo, useRef, useState } from "react"
import { cloneImageData, cutImageData, IPostion } from "./caculate"

export interface IFGLassProps {
  width: number,
  height: number,
  roundRadius?: number,
  color?:string
}


export const cutImage = (context: CanvasRenderingContext2D, option:IPostion)=>{
  
  const data =  context.getImageData(option.x,option.y,option.width,option.height)
  return data;
}

export const drawAsPic = (data:ImageData)=>{
  const canvas = document.createElement('canvas')
  canvas.width = data.width;
  canvas.height= data.height; 
  canvas.style.width = data.width+"px";
  canvas.style.height = data.height+"px"
  canvas.getContext('2d')?.putImageData(data,0,0);
  return canvas.toDataURL('jpg');
}




export const LGlass = ({rootComponent, style, className = "",children,gap=30}:{rootComponent?:HTMLElement | HTMLDivElement | HTMLBodyElement} & {text?:string,gap?:number} & {style?:CSSProperties, className?:string} & PropsWithChildren)=>{
  const [imageData,setImageData] = useState<ImageData | undefined>(undefined)
  const [root, setRoot] = useState(rootComponent)
  const [offsetPos, setOffsetPos] = useState<IPostion>()
  useEffect(()=>{
    setRoot(rootComponent || document.body)
  },[rootComponent])
  const pos = useMemo<IPostion & {toX: number, toY: number}>(()=>{
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      toX: 0,
      toY: 0
    }
  },[])
  // const [context, setContext] = useState<CanvasRenderingContext2D|null>()
  
  const btnRef = useRef<HTMLDivElement>(null)
  const [glassStyle,setGlassStyle] = useState<CSSProperties>({
    ...style,
    position:"absolute",
  })
  useEffect(()=>{
   const width = Number(style?.width?.toString().replace("px",''))
   const height = Number(style?.height?.toString().replace("px",""))
   const x = Number(style?.left?.toString().replace("px","")) || 0
   const y = Number(style?.top?.toString().replace("px","")) || 0
   pos.width  = width + gap*2;
   pos.height = height + gap*2;
   pos.toX = x - gap ;
   pos.toY = y - gap ;
  },[style])
  
  useEffect(()=>{
    const render = ()=>{
      pos.x += (pos.toX-pos.x)*0.8
      pos.y += (pos.toY-pos.y)*0.8
      setGlassStyle(sty=>{
          return {
            ...sty,
            transform:`translate(${pos.x+pos.width/2}px,${pos.y+pos.height/2}px)`,
          }
        })
        setOffsetPos({
          x: pos.x,
          y: pos.y,
          width: pos.width,
          height: pos.height
        })
      if(!root) return;
      let imgRef:ImageData|undefined = undefined;
      const {
        width,
        height
      } = root.getBoundingClientRect()
      // 此处优化方案：root 不用每次都draw，通过MutationObserver监听root是否发生变化
      root && btnRef.current && html2canvas(root,{
      ignoreElements:(el)=>{
        return el === btnRef.current
      },
      scale: 1,
      width,
      height,
      }).then(res=>{ 
        if(res.getContext('2d')) {
          const image = cloneImageData(res.getContext('2d')?.getImageData(0,0,width,height))
          if(image){
            imgRef = image?.imgData;
          } 
          
        }
        // setImageData(res.getContext('2d')?.getImageData(0,0,res.width,res.height));
        if(imgRef) {
          // setImageData(cutImage(context, offsetPos))
          const imgData = cutImageData(imgRef,pos)
          imgData && setImageData(imgData.imgData)
        }
      })
      
    }
    const interval = setInterval(render,100)
    return ()=>{
      clearInterval(interval)
    }
  },[root])
  return <div className={"l-glass " + className}  ref={btnRef} style={glassStyle}>
    <div style={{
      borderRadius:"12px",
      textShadow:"inset 0 10px 10px rgba(0, 0, 0, 0.5)",
      boxShadow:"inset 0 10px 10px rgba(0, 0, 0, 0.5)", position:'absolute',top:"-"+gap+"px", left:"-"+gap+"px",width: (offsetPos?.width||0) + "px", height:(offsetPos?.height||0)+"px"}}>
      {
        imageData && <img className="l-glass-bg"
        src={drawAsPic(imageData)} 
        style={{boxShadow:"inset 0 10px 10px rgba(0, 0, 0, 0.5)", borderRadius:"12px",width: (offsetPos?.width||0) + "px", height:(offsetPos?.height||0)+"px"}} />
      }
      <div>
      {
        children
      }
      </div>
    </div>
  </div>
}