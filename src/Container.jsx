import update from 'immutability-helper'
import { useCallback, useState } from 'react'
import Card from './Card'
const style = {
  width: 500,
  display: 'flex',
  flexWrap: 'wrap',
}
export default function Container() {
  const [cards, setCards] = useState([
    { id: 1, text: '1', },
    { id: 2, text: '2', },
    { id: 3, text: '3', },
    { id: 4, text: '4', },
    { id: 5, text: '5', },
    { id: 6, text: '6', },
    { id: 7, text: '7', },
    { id: 8, text: '8', },
    { id: 9, text: '9', },
    { id: 10, text: '10', },
    { id: 11, text: '11', },
    { id: 12, text: '12', },
  ])

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setCards((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      }),
    )
  }, [])

  const renderCard = useCallback((card, index) => {
    return (
      <Card
        key={card.id}
        index={index}
        id={card.id}
        text={card.text}
        moveCard={moveCard}
      />
    )
  }, [])

  return (
    <>
      <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
    </>
  )
}
