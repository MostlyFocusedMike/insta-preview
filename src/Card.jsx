import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  width: 100,
  height: 100,
  cursor: 'move',
}
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
    <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      <img src={imageSource} />
    </div>
  )
}
