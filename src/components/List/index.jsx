import classNames from 'classnames';

import './List.scss';

const List = ({ items, addClassName, onClick }) => {
  return (
  <ul onClick={onClick} className={classNames("list", addClassName)}>
    {items.map(({color, name, isActive}, i) => (
      <li key={i} className={classNames("list__item", {"list__item_active": isActive})}>
        <i className={classNames("list__icon", {"list__icon_colored": color, "list__icon_type_add-btn": addClassName})} style={{backgroundColor: color}}></i>
        <span className="list__label">{name}</span>
        {color ? <span className="list__close"></span> : null}
      </li>
    ))}
  </ul>
  )
}

export default List;