import React from "react"
import { None, Option } from "space-lift"
import { OscilatorControl } from "./oscillator-control"
import useOscillator from "./useOscillatorHook"

const getRandomInt = (max: number): number =>
  Math.floor(Math.random() * Math.floor(max))

export default () => {
  console.log("rendered")
  const smallCanvasRef = React.useRef<HTMLCanvasElement>(null)
  const zoomCanvasRef = React.useRef<HTMLCanvasElement>(null)
  const [url, setUrl] = React.useState<Option<string>>(None)
  const [colour, setColour] = React.useState<string>("white")
  const [frequency, setFrquency] = React.useState<number>(450)


  const test = (e: React.MouseEvent<HTMLCanvasElement>) => {
  }

  React.useEffect(() => {
    Option.all([smallCanvasRef.current, zoomCanvasRef.current]).fold(
      () => console.error("empty refs"),
      ([smallCanvas, zoomCanvas]) => {
        Option.all([
          smallCanvas.getContext("2d"),
          zoomCanvas.getContext("2d"),
        ]).fold(
          () => console.error("get 2d context fails"),
          ([smallCanvasContext, zoomCanvasContext]) => {
            zoomCanvasContext.imageSmoothingEnabled = false
            const imageData = smallCanvasContext.createImageData(100, 100)
            const pixels = imageData.data
            imageData.data.set(pixels.map(() => getRandomInt(255)))

            smallCanvasContext.putImageData(imageData, 0, 0)
            zoomCanvasContext.drawImage(smallCanvas, 0, 0, 1000, 1000)

            const handleMouseMove = (e: MouseEvent) => {
              const [x, y] = [e.clientX, e.clientY]
              const [r, g, b, a] = (zoomCanvasContext.getImageData(x, y, 1, 1)
                .data as unknown) as Array<number>

              const handleUpdateColours = () => {
                const rgba = `rgba(${r}, ${g}, ${b}, ${a})`
                setColour(rgba)
              }

              const handleUpdateFrequency = () => {
                setFrquency(r + b + g + a)
              }

              handleUpdateColours()
              handleUpdateFrequency()
            }
              zoomCanvas.addEventListener('mousemove', handleMouseMove)
          }

        )
      }
    )
  }, [])

  return (
    <>
      <div style={{ backgroundColor: colour }}>
        <canvas
          ref={smallCanvasRef}
          className="small-canvas"
          width={100}
          height={100}
          style={{ display: "none" }}
        ></canvas>
        <canvas
          ref={zoomCanvasRef}
          className="zoom-canvas"
          width={1000}
          height={1000}
        ></canvas>
        {frequency}
        {url.map((_) => (
          <a key="1" href={_} download="image.png">
            download
          </a>
        ))}
      </div>
    </>
  )
}
