import './Input.scss'

const Input = ({placeholder = 'Текст', type = 'text',}) => {
  return (<input className="input-field" type={type} placeholder={placeholder}/>)
}

export default Input;