import update from 'immutability-helper'
import { useCallback } from 'react'
import Card from './Card'

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
  }, [setImageSources]);

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
  }, [moveCard]);

  return (
    <>
      <div id="fake-phone-screen">
        { imageSources.map((imageSource, i) => renderCard(imageSource, i)) }
      </div>
    </>
  )
}
