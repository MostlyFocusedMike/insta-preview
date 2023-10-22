import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

export default function Card({ id, imageSource, index, moveCard }) {
  const ref = useRef(null)
  const [{ handlerId }, drop] = useDrop({
    accept: 'cardType',
    collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
    hover(item, monitor) {
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if ((dragIndex < hoverIndex && hoverClientY < hoverMiddleY)
        || (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)) return

      moveCard(dragIndex, hoverIndex)

      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'cardType',
    item: () => {
      return { id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1

  drag(drop(ref))

  return (
    <div
      className="preview-card"
      ref={ref}
      style={{ opacity, backgroundImage: `url(${imageSource})` }}
      data-handler-id={handlerId}
    >
      <img className="real-image" src={imageSource} />
    </div>
  )
}
