import update from 'immutability-helper'
import { useCallback } from 'react'
import Card from './Card'
const style = {
  width: 500,
  display: 'flex',
  flexWrap: 'wrap',
}

export default function Container({ imageSources, setImageSources }) {
  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setImageSources((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      }),
    )
  }, [])

  const renderCard = useCallback((imageSource, index) => {
    return (
      <Card
        key={imageSource}
        index={index}
        id={imageSource}
        moveCard={moveCard}
        imageSource={imageSource}
      />
    )
  }, [])

  return (
    <>
      <div style={style}>{imageSources.map((imageSource, i) => renderCard(imageSource, i))}</div>
    </>
  )
}
