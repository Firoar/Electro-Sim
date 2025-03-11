import classes from './WorkArea.module.css'
const ErrorInOpening = () => {
  return (
    <div className={classes['error-in-opening']}>
      <p>You can only open .chip files</p>
    </div>
  )
}
export default ErrorInOpening
