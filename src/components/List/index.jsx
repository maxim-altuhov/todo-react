import './List.scss';

const List = ({ items }) => {

  return (
  <ul className="list">
    {items.map(({icon, color, name, active}, i) => (
      <li className={active ? "list__item list__item_active" : "list__item"} key={i} >
        <i className={color ? "list__icon list__icon_colored" : "list__icon"} style={{backgroundColor: color}}>
          {icon}
        </i>
        <span className="list__label">{name}</span>
      </li>
    ))}
  </ul>
  )
}

export default List;