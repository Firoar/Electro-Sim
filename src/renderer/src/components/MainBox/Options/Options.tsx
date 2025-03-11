import { RootState } from 'public/renderer/src/store/store'
import { shallowEqual, useSelector } from 'react-redux'
import FileOption from './FileOption'
import BuiltInChipsOption from './BuiltInChipsOption'
import CustomChipsOptions from './CustomChipsOptions'

const Options = () => {
  const { clickedFileOption, clickedBuiltInChipsOption, clickedCustomChipsOption } = useSelector(
    (state: RootState) => state.fileExplorer,
    shallowEqual
  )

  return (
    <>
      {clickedFileOption && <FileOption />}
      {clickedBuiltInChipsOption && <BuiltInChipsOption />}
      {clickedCustomChipsOption && <CustomChipsOptions />}
    </>
  )
}
export default Options
