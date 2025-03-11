import { Content } from 'src/types/filedata'

export const findMaxId = (arr: Content[]) => {
  let maxi = 0
  if (!arr) return maxi
  // console.log(arr)
  arr.forEach((ele) => {
    maxi = Math.max(maxi, ele.id)
  })
  return maxi
}
