import './Spinner.scss';

const Spinner = ({ colorOne = '#cc00ff', colorTwo = '#ff2b2b', colorThree = '#ff9900' }) => {
  return (
    <div className="spinner">
      <div className="inner inner_puth_one" style={{ borderColor: colorOne }}></div>
      <div className="inner inner_puth_two" style={{ borderColor: colorTwo }}></div>
      <div className="inner inner_puth_three" style={{ borderColor: colorThree }}></div>
    </div>
  );
};

export default Spinner;
