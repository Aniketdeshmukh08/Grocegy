import react from 'react';

const ClearButton = ({ data, setData, searchText, setSearchText, originalData }) => {
  return (
    <button
      className='btn btn-outline-secondary mx-1 rounded'
      style={{ width: 'fit-content' }}
      onClick={() => {
        setData(originalData);
        setSearchText('');
      }}
    >
      Clear
    </button>
  );
};

export default ClearButton;