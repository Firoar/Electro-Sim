// import BuiltInChips from './BuiltInChips'
// import CustomChips from './CustomChips'
import File from './File'
import classes from './Navbar.module.css'

const Navbar = () => {
  // const {}=useSelector((state)=>state.)
  return (
    <div className={classes['navbar-main-div']}>
      <File />
      {/* <BuiltInChips />
      <CustomChips /> */}
    </div>
  )
}
export default Navbar
