import ReactLoading from 'react-loading'

type LoadingProps = {
  type: 'balls' | 'spin'
}

const Loading = ({ type }: LoadingProps) => {
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
    >
      <ReactLoading type={type} color="white" />
    </div>
  )
}

export default Loading
