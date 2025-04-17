// eslint-disable-next-line no-unused-vars
import React from 'react'


const Cards = (props) => {
  return (
    <div className="w-[450px] h-[250px] bg-gray-900 text-white rounded-2xl shadow-lg p-4 flex flex-col justify-between">
      <img className='w-[420px] h-[120px] p-1'src={props.imge} alt="Picture" />
      <div className="text-lg font-semibold">
          {props.course}
      </div>
      <div className="text-lg font-semibold">
          {props.price}
      </div>
      <button onClick={()=>props.onPayment(props.price,props.course)} className='mt-0 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition'>
          Buy Now
      </button>
    </div>
  )
}

export default Cards
