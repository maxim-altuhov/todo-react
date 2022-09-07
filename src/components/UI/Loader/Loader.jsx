import './Loader.scss';

const Loader = ({ color = '#8463ff' }) => {
  return <div className="loader" style={{ '--loader-var': color }}></div>;
};

export default Loader;
