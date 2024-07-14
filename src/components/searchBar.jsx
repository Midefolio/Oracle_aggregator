import React, { useContext, useEffect } from 'react';
import Select, { components } from 'react-select';
import { FixedSizeList as List } from 'react-window';
import { UtilsContext } from '../context/utilsContext';

const height = 35;

const MenuList = (props) => {
  const { options, children, maxHeight, getValue } = props;
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * height;

  return (
    <List
      height={maxHeight}
      itemCount={children.length}
      itemSize={height}
      initialScrollOffset={initialOffset}
    >
      {({ index, style }) => <div style={style}>{children[index]}</div>}
    </List>
  );
};

const SearchBar = () => {
  const { asset, selected, setSelected } = useContext(UtilsContext);
  console.log(asset)
  useEffect(() => {
    if (asset) {
      let init;
      const gsol = asset.find(i => i.label === 'SOLUSD');
      gsol? init = gsol : init = asset[0]
      if (init) {
        setSelected(init);
      }
    }
  }, [asset, setSelected]);

  return (
    <Select
      name="basic-select"
      value={selected}
      onChange={setSelected}
      options={asset}
      className="basic-select"
      classNamePrefix="select"
      components={{ MenuList }}
    />
  );
};

export default SearchBar;
